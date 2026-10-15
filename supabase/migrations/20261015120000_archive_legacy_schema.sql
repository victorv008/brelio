-- Arkiverar det tidiga schemat från MacBook-perioden (augusti 2026):
-- 8 demokurser utan innehåll och en tom admins-tabell. Tabellerna flyttas
-- till schemat `legacy`, som inte exponeras via API:t. Inget raderas.
create schema if not exists legacy;
revoke all on schema legacy from public, anon, authenticated;

alter table public.courses set schema legacy;
alter table public.admins set schema legacy;
