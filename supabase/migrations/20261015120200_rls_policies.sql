-- Row Level Security för alla tabeller.
--
-- Roller i Supabase:
--   anon          = besökare utan session
--   authenticated = inloggade, inklusive gäster (anonymous sign-in)
-- Admin är en authenticated-användare med profiles.role = 'admin'.

-- ---------------------------------------------------------------------------
-- Behörighetshjälpare (security definer så de kan läsa profiles oavsett RLS)
-- ---------------------------------------------------------------------------
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin' and status = 'active'
  );
$$;

create function private.is_active()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and status = 'active'
  );
$$;

-- Funktioner som används i policyer och CHECK-constraints måste kunna köras
-- av rollen som gör anropet.
grant execute on function
  private.is_admin(),
  private.is_active(),
  private.stockholm_today(),
  private.is_str(jsonb, int, int),
  private.is_opt_str(jsonb, int),
  private.valid_block(text, jsonb),
  private.valid_quiz_list(jsonb)
to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Slå på RLS överallt
-- ---------------------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.categories          enable row level security;
alter table public.courses             enable row level security;
alter table public.lessons             enable row level security;
alter table public.lesson_blocks       enable row level security;
alter table public.daily_quizzes       enable row level security;
alter table public.saved_courses       enable row level security;
alter table public.swipes              enable row level security;
alter table public.lesson_completions  enable row level security;
alter table public.daily_quiz_attempts enable row level security;
alter table public.xp_events           enable row level security;
alter table public.daily_activity      enable row level security;

-- ---------------------------------------------------------------------------
-- Tabellrättigheter (försvar på djupet — RLS är huvudspärren)
-- ---------------------------------------------------------------------------
-- Användardata skrivs bara via RPC-funktionerna (security definer).
revoke all on public.profiles, public.saved_courses, public.swipes,
  public.lesson_completions, public.daily_quiz_attempts, public.xp_events,
  public.daily_activity
from anon;

revoke insert, update, delete on public.profiles, public.swipes,
  public.lesson_completions, public.daily_quiz_attempts, public.xp_events,
  public.daily_activity
from authenticated;

-- På sin egen profil får man bara ändra de här kolumnerna. XP, streak,
-- roll och status ändras enbart av servern.
grant update (display_name, interests, onboarded) on public.profiles to authenticated;

-- Besökare utan session får bara läsa innehåll.
revoke insert, update, delete on public.categories, public.courses,
  public.lessons, public.lesson_blocks, public.daily_quizzes
from anon;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) and (select private.is_active()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create policy categories_select on public.categories
  for select to anon, authenticated
  using (true);

create policy categories_insert on public.categories
  for insert to authenticated
  with check ((select private.is_admin()));

create policy categories_update on public.categories
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy categories_delete on public.categories
  for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- courses — publicerade syns för alla, utkast bara för admin
-- ---------------------------------------------------------------------------
create policy courses_select on public.courses
  for select to anon, authenticated
  using (published or (select private.is_admin()));

create policy courses_insert on public.courses
  for insert to authenticated
  with check ((select private.is_admin()));

create policy courses_update on public.courses
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy courses_delete on public.courses
  for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- lessons — följer kursens publiceringsstatus
-- ---------------------------------------------------------------------------
create policy lessons_select on public.lessons
  for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.courses c where c.id = course_id and c.published)
  );

create policy lessons_insert on public.lessons
  for insert to authenticated
  with check ((select private.is_admin()));

create policy lessons_update on public.lessons
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy lessons_delete on public.lessons
  for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- lesson_blocks — följer lektionens kurs
-- ---------------------------------------------------------------------------
create policy lesson_blocks_select on public.lesson_blocks
  for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.lessons l
      join public.courses c on c.id = l.course_id
      where l.id = lesson_id and c.published
    )
  );

create policy lesson_blocks_insert on public.lesson_blocks
  for insert to authenticated
  with check ((select private.is_admin()));

create policy lesson_blocks_update on public.lesson_blocks
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy lesson_blocks_delete on public.lesson_blocks
  for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- daily_quizzes — dagens och tidigare quiz syns, framtida bara för admin
-- ---------------------------------------------------------------------------
create policy daily_quizzes_select on public.daily_quizzes
  for select to anon, authenticated
  using (quiz_date <= (select private.stockholm_today()) or (select private.is_admin()));

create policy daily_quizzes_insert on public.daily_quizzes
  for insert to authenticated
  with check ((select private.is_admin()));

create policy daily_quizzes_update on public.daily_quizzes
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy daily_quizzes_delete on public.daily_quizzes
  for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- saved_courses — användaren sparar och tar bort sina egna
-- ---------------------------------------------------------------------------
create policy saved_courses_select on public.saved_courses
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy saved_courses_insert on public.saved_courses
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (select private.is_active())
    and exists (select 1 from public.courses c where c.id = course_id and c.published)
  );

create policy saved_courses_delete on public.saved_courses
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Läsbara egna rader (skrivs bara via RPC)
-- ---------------------------------------------------------------------------
create policy swipes_select on public.swipes
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy lesson_completions_select on public.lesson_completions
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy daily_quiz_attempts_select on public.daily_quiz_attempts
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy xp_events_select on public.xp_events
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy daily_activity_select on public.daily_activity
  for select to authenticated
  using ((select private.is_admin()));
