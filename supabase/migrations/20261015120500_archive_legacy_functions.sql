-- De gamla funktionerna från MacBook-schemat flyttas till `legacy`, så de
-- inte längre exponeras som /rest/v1/rpc/* (security advisor-varning).
alter function public.is_admin() set schema legacy;
alter function public.touch_updated_at() set schema legacy;
