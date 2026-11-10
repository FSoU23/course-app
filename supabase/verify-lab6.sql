-- Только чтение структуры и прав; запускать в SQL Editor после миграции ЛР 6.
select policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' and tablename = 'books';

select
  (select column_default from information_schema.columns where table_schema='public'
    and table_name='books' and column_name='owner_id') as owner_default,
  (select relrowsecurity from pg_class where oid='public.books'::regclass) as rls_enabled,
  has_table_privilege('anon','public.books','SELECT,INSERT,UPDATE,DELETE') as anon_access,
  has_table_privilege('authenticated','public.books','SELECT')
  and has_table_privilege('authenticated','public.books','INSERT')
  and has_table_privilege('authenticated','public.books','UPDATE')
  and has_table_privilege('authenticated','public.books','DELETE') as authenticated_crud;
-- Ожидается четыре политики, auth.uid(), true, false, true.
