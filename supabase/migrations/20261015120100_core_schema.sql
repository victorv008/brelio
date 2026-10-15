-- QuickThinkers kärnschema: profiler, innehåll (kategorier → kurser →
-- lektioner → block), dagens quiz och användardata.
--
-- Hjälpfunktioner ligger i schemat `private`, som inte exponeras via
-- PostgREST. De kan användas i RLS-policyer men inte anropas från klienten.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;
alter default privileges in schema private revoke execute on functions from public;

-- ---------------------------------------------------------------------------
-- Hjälpare
-- ---------------------------------------------------------------------------
create function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Streaks och "dagens" quiz räknas i svensk tid, inte UTC.
create function private.stockholm_today()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Europe/Stockholm')::date;
$$;

-- Validerar innehållet i ett lektionsblock. Används som CHECK-constraint så
-- att trasiga block aldrig kan sparas, oavsett vad klienten skickar.
-- OBS: en CHECK släpper igenom NULL, så funktionen får aldrig returnera NULL.
create function private.is_str(v jsonb, min_len int, max_len int)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    jsonb_typeof(v) = 'string' and char_length(btrim(v #>> '{}')) between min_len and max_len,
    false
  );
$$;

-- Valfritt strängfält: saknas helt eller är en sträng.
create function private.is_opt_str(v jsonb, max_len int)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select v is null or private.is_str(v, 0, max_len);
$$;

create function private.valid_block(p_type text, c jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  n int;
begin
  if c is null or coalesce(jsonb_typeof(c), '') <> 'object' then
    return false;
  end if;

  if p_type = 'text' then
    return private.is_str(c->'body', 1, 20000);

  elsif p_type = 'image' then
    return private.is_str(c->'path', 1, 500)
      and private.is_opt_str(c->'alt', 300)
      and private.is_opt_str(c->'caption', 300);

  elsif p_type = 'video' then
    return private.is_str(c->'youtube_id', 11, 11)
      and coalesce((c->>'youtube_id') ~ '^[A-Za-z0-9_-]{11}$', false)
      and private.is_opt_str(c->'caption', 300);

  elsif p_type = 'flashcard' then
    return private.is_str(c->'question', 1, 1000)
      and private.is_str(c->'answer', 1, 4000);

  elsif p_type = 'quiz' then
    if not private.is_str(c->'question', 1, 1000) then
      return false;
    end if;
    if coalesce(jsonb_typeof(c->'options'), '') <> 'array' then
      return false;
    end if;
    n := jsonb_array_length(c->'options');
    if n < 2 or n > 4 then
      return false;
    end if;
    if exists (
      select 1 from jsonb_array_elements(c->'options') o
      where not private.is_str(o, 1, 200)
    ) then
      return false;
    end if;
    if coalesce(jsonb_typeof(c->'correct_index'), '') <> 'number' then
      return false;
    end if;
    if not coalesce((c->>'correct_index') ~ '^[0-9]+$', false) then
      return false;
    end if;
    return (c->>'correct_index')::int < n;
  end if;

  return false;
end;
$$;

create function private.valid_quiz_list(q jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
begin
  if q is null or coalesce(jsonb_typeof(q), '') <> 'array' then
    return false;
  end if;
  if jsonb_array_length(q) < 1 or jsonb_array_length(q) > 10 then
    return false;
  end if;
  return not exists (
    select 1 from jsonb_array_elements(q) item
    where not private.valid_block('quiz', item)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiler (en rad per auth.users, skapas av trigger)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text not null default '' check (char_length(display_name) <= 60),
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'active' check (status in ('active', 'banned')),
  is_anonymous boolean not null default true,
  xp integer not null default 0 check (xp >= 0),
  streak_count integer not null default 0 check (streak_count >= 0),
  streak_last_date date,
  interests uuid[] not null default '{}' check (cardinality(interests) <= 20),
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  registered_at timestamptz,
  last_active_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role) where role = 'admin';
create index profiles_registered_at_idx on public.profiles (registered_at);

-- ---------------------------------------------------------------------------
-- Innehåll
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,40}$'),
  label text not null check (char_length(label) between 1 and 40),
  emoji text not null default '📚' check (char_length(emoji) between 1 and 8),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  why text not null default '' check (char_length(why) <= 200),
  category_id uuid references public.categories (id) on delete set null,
  emoji text not null default '📚' check (char_length(emoji) between 1 and 8),
  level text not null default 'Nybörjare' check (level in ('Nybörjare', 'Medel', 'Avancerad')),
  xp integer not null default 100 check (xp between 0 and 10000),
  glow text not null default '#7C6BFF' check (glow ~ '^#[0-9A-Fa-f]{6}$'),
  -- Kortkonsten är en CSS-gradient. Inga url() — då kan kortet inte ladda
  -- externa resurser.
  poster text not null default 'linear-gradient(150deg,#1b1b27,#242433)'
    check (poster ~ '^(linear|radial)-gradient\(' and poster !~* 'url\(' and char_length(poster) <= 300),
  cover_image_path text check (char_length(cover_image_path) <= 500),
  tags text[] not null default '{}' check (cardinality(tags) <= 20),
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

create index courses_published_sort_idx on public.courses (published, sort_order);
create index courses_category_idx on public.courses (category_id);
create index courses_created_by_idx on public.courses (created_by);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  minutes integer not null default 5 check (minutes between 1 and 120),
  display_mode text not null default 'stories' check (display_mode in ('stories', 'scroll')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lessons_course_sort_idx on public.lessons (course_id, sort_order);

create table public.lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  type text not null check (type in ('text', 'image', 'video', 'flashcard', 'quiz')),
  content jsonb not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lesson_blocks_content_valid check (private.valid_block(type, content))
);

create index lesson_blocks_lesson_sort_idx on public.lesson_blocks (lesson_id, sort_order);

create table public.daily_quizzes (
  quiz_date date primary key,
  questions jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_quizzes_questions_valid check (private.valid_quiz_list(questions))
);

-- ---------------------------------------------------------------------------
-- Användardata (skrivs via RPC-funktioner, se rpc-migrationen)
-- ---------------------------------------------------------------------------
create table public.saved_courses (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create index saved_courses_course_idx on public.saved_courses (course_id);

-- Senaste swipen per användare och kurs.
create table public.swipes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  action text not null check (action in ('like', 'skip', 'save')),
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create index swipes_course_idx on public.swipes (course_id);

create table public.lesson_completions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index lesson_completions_lesson_idx on public.lesson_completions (lesson_id);
create index lesson_completions_course_idx on public.lesson_completions (course_id, user_id);

create table public.daily_quiz_attempts (
  user_id uuid not null references public.profiles (id) on delete cascade,
  quiz_date date not null references public.daily_quizzes (quiz_date) on delete cascade,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  created_at timestamptz not null default now(),
  primary key (user_id, quiz_date)
);

create index daily_quiz_attempts_date_idx on public.daily_quiz_attempts (quiz_date);

-- XP-liggare. Unik på (användare, anledning, referens) så samma like,
-- lektion eller quizdag aldrig ger XP två gånger.
create table public.xp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null check (reason in ('like', 'lesson', 'daily_quiz')),
  ref text not null,
  amount integer not null check (amount > 0),
  created_at timestamptz not null default now(),
  unique (user_id, reason, ref)
);

-- En rad per användare och aktiv dag — underlag för DAU/MAU.
create table public.daily_activity (
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_date date not null,
  primary key (user_id, activity_date)
);

create index daily_activity_date_idx on public.daily_activity (activity_date);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create trigger courses_touch_updated_at before update on public.courses
  for each row execute function private.touch_updated_at();
create trigger lessons_touch_updated_at before update on public.lessons
  for each row execute function private.touch_updated_at();
create trigger lesson_blocks_touch_updated_at before update on public.lesson_blocks
  for each row execute function private.touch_updated_at();
create trigger daily_quizzes_touch_updated_at before update on public.daily_quizzes
  for each row execute function private.touch_updated_at();

-- En kurs kan inte publiceras utan lektioner, eller med en tom lektion.
create function private.check_course_publishable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.published and (tg_op = 'INSERT' or not old.published) then
    if not exists (select 1 from public.lessons where course_id = new.id) then
      raise exception 'Kursen behöver minst en lektion innan den kan publiceras.'
        using errcode = 'check_violation';
    end if;
    if exists (
      select 1 from public.lessons l
      where l.course_id = new.id
        and not exists (select 1 from public.lesson_blocks b where b.lesson_id = l.id)
    ) then
      raise exception 'Alla lektioner måste ha minst ett block innan kursen kan publiceras.'
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$;

create trigger courses_check_publishable before insert or update of published on public.courses
  for each row execute function private.check_course_publishable();

-- Profil skapas automatiskt för varje ny auth-användare (även gäster).
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, is_anonymous, registered_at)
  values (
    new.id,
    new.email,
    coalesce(new.is_anonymous, false),
    case when coalesce(new.is_anonymous, false) then null else now() end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.handle_new_user();

-- När en gäst blir ett riktigt konto (eller byter e-post) följer profilen med.
create function private.handle_user_updated()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
     set email = new.email,
         is_anonymous = coalesce(new.is_anonymous, false),
         registered_at = case
           when registered_at is null and not coalesce(new.is_anonymous, false) then now()
           else registered_at
         end
   where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_updated after update of email, is_anonymous on auth.users
  for each row execute function private.handle_user_updated();

-- Befintliga konton (skapade innan den här migrationen) får också en profil.
insert into public.profiles (id, email, is_anonymous, created_at, registered_at)
select
  u.id,
  u.email,
  coalesce(u.is_anonymous, false),
  u.created_at,
  case when coalesce(u.is_anonymous, false) then null else u.created_at end
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Startkategorier (de åtta från appen)
-- ---------------------------------------------------------------------------
insert into public.categories (slug, label, emoji, sort_order) values
  ('design',  'Design',  '🎨', 1),
  ('kod',     'Kod',     '💻', 2),
  ('foto',    'Foto',    '📷', 3),
  ('sprak',   'Språk',   '✍️', 4),
  ('pengar',  'Pengar',  '💰', 5),
  ('halsa',   'Hälsa',   '🏃', 6),
  ('musik',   'Musik',   '🎵', 7),
  ('karriar', 'Karriär', '🎤', 8);
