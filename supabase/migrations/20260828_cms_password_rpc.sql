create or replace function public.validate_cms_password(p_key text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare expected text;
begin
  if p_key is null or btrim(p_key) = '' then return false; end if;
  select key_hash into expected from public.cms_access_key where id=true;
  if expected is null then return false; end if;
  return encode(extensions.digest(p_key,'sha256'),'hex') = expected;
end;
$$;
revoke all on function public.validate_cms_password(text) from public;
grant execute on function public.validate_cms_password(text) to anon, authenticated;
