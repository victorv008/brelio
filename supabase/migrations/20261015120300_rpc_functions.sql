-- RPC-funktioner. Allt som ger XP eller påverkar streak räknas här på
-- servern, så klienten inte kan dela ut poäng till sig själv.

-- ---------------------------------------------------------------------------
-- Interna hjälpare
-- ---------------------------------------------------------------------------

-- Returnerar inloggad användares id, eller kastar om sessionen saknas eller
-- kontot är avstängt.
create function private.require_active_user()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Du behöver vara inloggad.' using errcode = '28000';
  end if;
  if not exists (select 1 from public.profiles where id = v_uid and status = 'active') then
    raise exception 'Ditt konto är avstängt.' using errcode = '42501';
  end if;
  return v_uid;
end;
$$;

create function private.require_admin()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'Du har inte admin-behörighet.' using errcode = '42501';
  end if;
  return auth.uid();
end;
$$;

-- Markerar dagen som aktiv och uppdaterar streaken:
-- samma dag → oförändrad, dagen efter → +1, annars börjar om på 1.
create function private.touch_activity(p_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := private.stockholm_today();
begin
  insert into public.daily_activity (user_id, activity_date)
  values (p_user, v_today)
  on conflict do nothing;

  update public.profiles
     set streak_count = case
           when streak_last_date = v_today then streak_count
           when streak_last_date = v_today - 1 then streak_count + 1
           else 1
         end,
         streak_last_date = v_today,
         last_active_at = now()
   where id = p_user;
end;
$$;

-- Delar ut XP en gång per (anledning, referens). Returnerar utdelad mängd
-- (0 om den redan delats ut).
create function private.award_xp(p_user uuid, p_reason text, p_ref text, p_amount int)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_rows int;
begin
  if p_amount is null or p_amount <= 0 then
    return 0;
  end if;

  insert into public.xp_events (user_id, reason, ref, amount)
  values (p_user, p_reason, p_ref, p_amount)
  on conflict (user_id, reason, ref) do nothing;

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    return 0;
  end if;

  update public.profiles set xp = xp + p_amount where id = p_user;
  return p_amount;
end;
$$;

create function private.profile_summary(p_user uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'xp', xp,
    'streak_count', streak_count,
    'streak_last_date', streak_last_date
  )
  from public.profiles
  where id = p_user;
$$;

-- ---------------------------------------------------------------------------
-- Användarfunktioner
-- ---------------------------------------------------------------------------

-- Like/skip/save på en kurs. Like ger 10 XP en gång per kurs.
create function public.record_swipe(p_course_id uuid, p_action text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := private.require_active_user();
  v_xp int := 0;
begin
  if p_action is null or p_action not in ('like', 'skip', 'save') then
    raise exception 'Ogiltig swipe.' using errcode = '22023';
  end if;
  if not exists (select 1 from public.courses where id = p_course_id and published) then
    raise exception 'Kursen finns inte.' using errcode = 'P0002';
  end if;

  insert into public.swipes (user_id, course_id, action)
  values (v_uid, p_course_id, p_action)
  on conflict (user_id, course_id)
  do update set action = excluded.action, created_at = now();

  if p_action = 'save' then
    insert into public.saved_courses (user_id, course_id)
    values (v_uid, p_course_id)
    on conflict do nothing;
  elsif p_action = 'like' then
    v_xp := private.award_xp(v_uid, 'like', p_course_id::text, 10);
  end if;

  perform private.touch_activity(v_uid);

  return jsonb_build_object('xp_awarded', v_xp) || private.profile_summary(v_uid);
end;
$$;

-- Markerar en lektion som klar. XP = kursens total-XP fördelat på antalet
-- lektioner (minst 5), en gång per lektion.
create function public.complete_lesson(p_lesson_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := private.require_active_user();
  v_course_id uuid;
  v_course_xp int;
  v_published boolean;
  v_total int;
  v_done int;
  v_xp int;
begin
  select c.id, c.xp, c.published
    into v_course_id, v_course_xp, v_published
    from public.lessons l
    join public.courses c on c.id = l.course_id
   where l.id = p_lesson_id;

  if v_course_id is null or not v_published then
    raise exception 'Lektionen finns inte.' using errcode = 'P0002';
  end if;

  insert into public.lesson_completions (user_id, lesson_id, course_id)
  values (v_uid, p_lesson_id, v_course_id)
  on conflict do nothing;

  select count(*) into v_total from public.lessons where course_id = v_course_id;

  v_xp := private.award_xp(
    v_uid, 'lesson', p_lesson_id::text,
    greatest(5, round(v_course_xp::numeric / greatest(v_total, 1))::int)
  );

  perform private.touch_activity(v_uid);

  select count(*) into v_done
    from public.lesson_completions lc
    join public.lessons l on l.id = lc.lesson_id
   where lc.user_id = v_uid and l.course_id = v_course_id;

  return jsonb_build_object(
    'xp_awarded', v_xp,
    'lessons_done', v_done,
    'lessons_total', v_total,
    'course_completed', v_done >= v_total
  ) || private.profile_summary(v_uid);
end;
$$;

-- Dagens quiz: ett försök per dag, poängen räknas här. 25 XP per rätt svar.
create function public.submit_daily_quiz(p_quiz_date date, p_answers int[])
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := private.require_active_user();
  v_today date := private.stockholm_today();
  v_questions jsonb;
  v_total int;
  v_score int := 0;
  v_rows int;
  v_xp int;
  i int;
begin
  if p_quiz_date is distinct from v_today then
    raise exception 'Dagens quiz har bytts ut. Ladda om sidan.' using errcode = '22023';
  end if;

  select questions into v_questions from public.daily_quizzes where quiz_date = v_today;
  if v_questions is null then
    raise exception 'Det finns inget quiz idag.' using errcode = 'P0002';
  end if;

  v_total := jsonb_array_length(v_questions);
  if p_answers is null or coalesce(array_length(p_answers, 1), 0) <> v_total then
    raise exception 'Fel antal svar.' using errcode = '22023';
  end if;

  for i in 0 .. v_total - 1 loop
    if p_answers[i + 1] = (v_questions -> i ->> 'correct_index')::int then
      v_score := v_score + 1;
    end if;
  end loop;

  insert into public.daily_quiz_attempts (user_id, quiz_date, score, total)
  values (v_uid, v_today, v_score, v_total)
  on conflict do nothing;

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    raise exception 'Du har redan gjort dagens quiz.' using errcode = '23505';
  end if;

  v_xp := private.award_xp(v_uid, 'daily_quiz', v_today::text, v_score * 25);
  perform private.touch_activity(v_uid);

  return jsonb_build_object('score', v_score, 'total', v_total, 'xp_awarded', v_xp)
    || private.profile_summary(v_uid);
end;
$$;

-- ---------------------------------------------------------------------------
-- Adminfunktioner
-- ---------------------------------------------------------------------------

-- Byt roll user ↔ admin. Man kan inte ta bort sin egen admin-roll, vilket
-- också garanterar att det alltid finns minst en admin kvar.
create function public.admin_set_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin uuid := private.require_admin();
  v_anonymous boolean;
begin
  if p_role is null or p_role not in ('user', 'admin') then
    raise exception 'Ogiltig roll.' using errcode = '22023';
  end if;

  select is_anonymous into v_anonymous from public.profiles where id = p_user_id;
  if not found then
    raise exception 'Användaren finns inte.' using errcode = 'P0002';
  end if;

  if p_user_id = v_admin and p_role <> 'admin' then
    raise exception 'Du kan inte ta bort din egen admin-roll.' using errcode = '42501';
  end if;
  if p_role = 'admin' and v_anonymous then
    raise exception 'Ett gästkonto kan inte bli admin.' using errcode = '42501';
  end if;

  update public.profiles set role = p_role where id = p_user_id;
end;
$$;

-- Statistik för adminportalens Analytics-vy. Formen matchar vad
-- js/admin/views/analytics.js förväntar sig.
create function public.admin_analytics()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_today date;
  v_dau int;
  v_dau_prev int;
  v_new int;
  v_new_prev int;
  v_starts int;
  v_completions int;
  v_result jsonb;
begin
  perform private.require_admin();
  v_today := private.stockholm_today();

  select count(*) into v_dau from public.daily_activity where activity_date = v_today;
  select count(*) into v_dau_prev from public.daily_activity where activity_date = v_today - 7;

  select count(*) into v_new from public.profiles
   where registered_at is not null
     and (registered_at at time zone 'Europe/Stockholm')::date > v_today - 7;
  select count(*) into v_new_prev from public.profiles
   where registered_at is not null
     and (registered_at at time zone 'Europe/Stockholm')::date between v_today - 13 and v_today - 7;

  -- Påbörjad = minst en klar lektion. Klar = alla kursens lektioner klara.
  with progress as (
    select lc.user_id, lc.course_id, count(*) as done
      from public.lesson_completions lc
      join public.courses c on c.id = lc.course_id and c.published
     group by lc.user_id, lc.course_id
  ),
  totals as (
    select course_id, count(*) as total from public.lessons group by course_id
  )
  select count(*), count(*) filter (where p.done >= t.total)
    into v_starts, v_completions
    from progress p
    join totals t on t.course_id = p.course_id;

  with days as (
    select generate_series(v_today - 29, v_today, interval '1 day')::date as d
  ),
  course_rows as (
    select
      c.id,
      c.title,
      c.emoji,
      coalesce(cat.label, '—') as category,
      coalesce(cat.emoji, '•') as category_emoji,
      (select count(distinct lc.user_id) from public.lesson_completions lc where lc.course_id = c.id) as starts,
      (select count(*) from (
         select lc.user_id
           from public.lesson_completions lc
          where lc.course_id = c.id
          group by lc.user_id
         having count(*) >= (select count(*) from public.lessons l where l.course_id = c.id)
       ) done) as completions,
      (select count(*) from public.swipes s where s.course_id = c.id) as swipes,
      (select count(*) from public.swipes s where s.course_id = c.id and s.action = 'like') as likes,
      (select count(*) from public.saved_courses sc where sc.course_id = c.id) as saves
    from public.courses c
    left join public.categories cat on cat.id = c.category_id
    where c.published
  )
  select jsonb_build_object(
    'dailyActive', (
      select jsonb_agg(jsonb_build_object(
        'date', d,
        'value', (select count(*) from public.daily_activity a where a.activity_date = days.d)
      ) order by d)
      from days
    ),
    'signups', (
      select jsonb_agg(jsonb_build_object(
        'date', d,
        'value', (select count(*) from public.profiles p
                   where p.registered_at is not null
                     and (p.registered_at at time zone 'Europe/Stockholm')::date = days.d)
      ) order by d)
      from days
    ),
    'kpis', jsonb_build_object(
      'dau', v_dau,
      'dauChange', case when v_dau_prev > 0 then round((v_dau - v_dau_prev) * 100.0 / v_dau_prev, 1) end,
      'mau', (select count(distinct user_id) from public.daily_activity where activity_date > v_today - 30),
      'newUsers', v_new,
      'newUsersChange', case when v_new_prev > 0 then round((v_new - v_new_prev) * 100.0 / v_new_prev, 1) end,
      'totalUsers', (select count(*) from public.profiles where not is_anonymous),
      'activeUsers', (select count(*) from public.profiles where not is_anonymous and status = 'active'),
      'guests', (select count(*) from public.profiles where is_anonymous),
      'completionRate', case when v_starts > 0 then round(v_completions * 100.0 / v_starts) else 0 end,
      'totalSwipes', (select count(*) from public.swipes),
      'avgStreak', coalesce((
        select round(avg(case when streak_last_date >= v_today - 1 then streak_count else 0 end), 1)
          from public.profiles where not is_anonymous
      ), 0),
      'publishedCourses', (select count(*) from public.courses where published),
      'draftCourses', (select count(*) from public.courses where not published)
    ),
    'courseStats', coalesce((
      select jsonb_agg(jsonb_build_object(
        'courseId', id,
        'title', title,
        'emoji', emoji,
        'category', category,
        'starts', starts,
        'completions', completions,
        'completionRate', case when starts > 0 then round(completions * 100.0 / starts) else 0 end,
        'swipes', swipes,
        'likes', likes,
        'saves', saves
      ) order by starts desc, title)
      from course_rows
    ), '[]'::jsonb),
    'categoryBreakdown', coalesce((
      select jsonb_agg(jsonb_build_object('category', category, 'emoji', category_emoji, 'value', value)
                       order by value desc, category)
        from (
          select category, category_emoji, sum(starts) as value
            from course_rows
           group by category, category_emoji
        ) per_cat
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

-- ---------------------------------------------------------------------------
-- Rättigheter: bara inloggade (inkl. gäster) får anropa RPC:erna
-- ---------------------------------------------------------------------------
revoke execute on function
  public.record_swipe(uuid, text),
  public.complete_lesson(uuid),
  public.submit_daily_quiz(date, int[]),
  public.admin_set_role(uuid, text),
  public.admin_analytics()
from public, anon;

grant execute on function
  public.record_swipe(uuid, text),
  public.complete_lesson(uuid),
  public.submit_daily_quiz(date, int[]),
  public.admin_set_role(uuid, text),
  public.admin_analytics()
to authenticated;

-- Interna hjälpare anropas bara inifrån andra security definer-funktioner.
revoke execute on function
  private.require_active_user(),
  private.require_admin(),
  private.touch_activity(uuid),
  private.award_xp(uuid, text, text, int),
  private.profile_summary(uuid),
  private.check_course_publishable(),
  private.handle_new_user(),
  private.handle_user_updated(),
  private.touch_updated_at()
from public, anon, authenticated;
