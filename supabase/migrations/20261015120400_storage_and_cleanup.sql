-- Bilder till kurser och lektioner. Publik läsning (via publik URL),
-- uppladdning och borttagning bara för admin. SVG är inte tillåtet
-- eftersom det kan innehålla skript.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-media',
  'course-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy course_media_admin_select on storage.objects
  for select to authenticated
  using (bucket_id = 'course-media' and (select private.is_admin()));

create policy course_media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'course-media' and (select private.is_admin()));

create policy course_media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'course-media' and (select private.is_admin()))
  with check (bucket_id = 'course-media' and (select private.is_admin()));

create policy course_media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'course-media' and (select private.is_admin()));

-- Gästkonton som inte använts på 30 dagar tas bort varje natt (03:17 UTC).
-- Profil och all data följer med via ON DELETE CASCADE.
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'cleanup-inactive-guests',
  '17 3 * * *',
  $$
    delete from auth.users u
     using public.profiles p
     where p.id = u.id
       and u.is_anonymous
       and p.last_active_at < now() - interval '30 days'
  $$
);
