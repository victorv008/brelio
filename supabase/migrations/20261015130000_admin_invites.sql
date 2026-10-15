-- Engångsinbjudningar till adminportalen. En admin skapar en länk; den som
-- öppnar den väljer själv e-post och lösenord och blir admin. Bara en
-- SHA-256-hash av koden sparas, så länken går inte att läsa ut i efterhand.
-- Själva inlösen sker i Edge Function accept-invite (kräver secret-nyckel).

create table public.admin_invites (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references auth.users (id) on delete set null,
  revoked_at timestamptz
);

create index admin_invites_created_by_idx on public.admin_invites (created_by);
create index admin_invites_used_by_idx on public.admin_invites (used_by);

alter table public.admin_invites enable row level security;

revoke all on public.admin_invites from anon, authenticated;
grant select on public.admin_invites to authenticated;

create policy admin_invites_select on public.admin_invites
  for select to authenticated
  using ((select private.is_admin()));

-- Skapar en inbjudan och returnerar koden i klartext — enda gången den syns.
-- 2 × gen_random_uuid ger 244 bitar slump; sha256 är inbyggd i Postgres.
create function public.admin_create_invite()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin uuid := private.require_admin();
  v_token text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  v_row public.admin_invites%rowtype;
begin
  insert into public.admin_invites (token_hash, created_by, expires_at)
  values (encode(sha256(convert_to(v_token, 'UTF8')), 'hex'), v_admin, now() + interval '7 days')
  returning * into v_row;

  return jsonb_build_object('id', v_row.id, 'token', v_token, 'expires_at', v_row.expires_at);
end;
$$;

create function public.admin_revoke_invite(p_invite_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();
  update public.admin_invites
     set revoked_at = now()
   where id = p_invite_id and used_at is null and revoked_at is null;
end;
$$;

revoke execute on function public.admin_create_invite(), public.admin_revoke_invite(uuid) from public, anon;
grant execute on function public.admin_create_invite(), public.admin_revoke_invite(uuid) to authenticated;
