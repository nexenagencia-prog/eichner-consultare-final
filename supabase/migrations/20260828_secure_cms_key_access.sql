create table if not exists public.cms_access_key (
  id boolean primary key default true check (id = true),
  key_hash text not null,
  updated_at timestamptz not null default now()
);
insert into public.cms_access_key(id,key_hash)
values (true, '22bab48a63b7ddcce974b97c72da5967ac701d8b2e7dca932a2c5564068c2011')
on conflict (id) do update set key_hash=excluded.key_hash, updated_at=now();
revoke all on public.cms_access_key from public, anon, authenticated;
create or replace function public.has_valid_cms_key()
returns boolean language plpgsql stable security definer set search_path = public, extensions as $$
declare headers jsonb; supplied text; expected text;
begin
  begin headers := coalesce(current_setting('request.headers', true), '{}')::jsonb;
  exception when others then headers := '{}'::jsonb; end;
  supplied := coalesce(headers->>'x-cms-key','');
  select key_hash into expected from public.cms_access_key where id=true;
  if expected is null or supplied = '' then return false; end if;
  return encode(extensions.digest(supplied,'sha256'),'hex') = expected;
end; $$;
create or replace function public.validate_cms_access()
returns boolean language sql stable security definer set search_path = public
as $$ select public.has_valid_cms_key() or public.is_cms_admin(); $$;
grant execute on function public.validate_cms_access() to anon, authenticated;
grant execute on function public.has_valid_cms_key() to anon, authenticated;
alter table public.site_content enable row level security;
drop policy if exists "cms key or admin update site content" on public.site_content;
create policy "cms key or admin update site content" on public.site_content for update to anon, authenticated using (public.has_valid_cms_key() or public.is_cms_admin()) with check (public.has_valid_cms_key() or public.is_cms_admin());
drop policy if exists "cms key or admin insert site content" on public.site_content;
create policy "cms key or admin insert site content" on public.site_content for insert to anon, authenticated with check (public.has_valid_cms_key() or public.is_cms_admin());
drop policy if exists "site_content_auth_write" on public.site_content;
drop policy if exists "cms key or admin upload site media" on storage.objects;
create policy "cms key or admin upload site media" on storage.objects for insert to anon, authenticated with check (bucket_id='site-media' and (public.has_valid_cms_key() or public.is_cms_admin()));
drop policy if exists "cms key or admin update site media" on storage.objects;
create policy "cms key or admin update site media" on storage.objects for update to anon, authenticated using (bucket_id='site-media' and (public.has_valid_cms_key() or public.is_cms_admin())) with check (bucket_id='site-media' and (public.has_valid_cms_key() or public.is_cms_admin()));
drop policy if exists "cms key or admin delete site media" on storage.objects;
create policy "cms key or admin delete site media" on storage.objects for delete to anon, authenticated using (bucket_id='site-media' and (public.has_valid_cms_key() or public.is_cms_admin()));
drop policy if exists "site_media_auth_insert" on storage.objects;
drop policy if exists "site_media_auth_update" on storage.objects;
drop policy if exists "site_media_auth_delete" on storage.objects;
