-- Выполнить после миграции и seed в SQL Editor. Все изменения откатываются.
begin;
do $$
begin
  if (select count(*) from public.genres) <> 7 then
    raise exception 'Ожидалось 7 жанров после seed';
  end if;
  if exists (select 1 from pg_class where oid in ('public.genres'::regclass,
      'public.books'::regclass) and not relrowsecurity) then
    raise exception 'RLS должен быть включён';
  end if;
  if not has_table_privilege('anon', 'public.genres', 'SELECT')
    or not has_table_privilege('authenticated', 'public.genres', 'SELECT') then
    raise exception 'Не разрешено чтение справочника';
  end if;
  if has_table_privilege('anon', 'public.genres', 'INSERT')
    or has_table_privilege('anon', 'public.genres', 'UPDATE')
    or has_table_privilege('anon', 'public.genres', 'DELETE')
    or has_table_privilege('authenticated', 'public.genres', 'INSERT')
    or has_table_privilege('authenticated', 'public.genres', 'UPDATE')
    or has_table_privilege('authenticated', 'public.genres', 'DELETE')
    or has_table_privilege('anon', 'public.books', 'SELECT')
    or has_table_privilege('anon', 'public.books', 'INSERT')
    or has_table_privilege('anon', 'public.books', 'UPDATE')
    or has_table_privilege('anon', 'public.books', 'DELETE')
    or has_table_privilege('authenticated', 'public.books', 'SELECT')
    or has_table_privilege('authenticated', 'public.books', 'INSERT')
    or has_table_privilege('authenticated', 'public.books', 'UPDATE')
    or has_table_privilege('authenticated', 'public.books', 'DELETE') then
    raise exception 'Лишние клиентские права';
  end if;

  begin
    insert into public.genres values ('', 'Проверка пустого id');
    raise exception 'Пустой id принят';
  exception when check_violation then null;
  end;
  begin
    insert into public.genres values ('__check_empty', '');
    raise exception 'Пустое имя принято';
  exception when check_violation then null;
  end;
  begin
    insert into public.genres values ('novel', 'Проверка повторного id');
    raise exception 'Повторный id принят';
  exception when unique_violation then null;
  end;
  begin
    insert into public.books (owner_id, title, author, genre_id, added_at)
      values (null, 'Проверка', 'Автор', 'novel', current_date);
    raise exception 'Книга без владельца принята';
  exception when not_null_violation then null;
  end;
  raise notice 'Ограничения, RLS и права проверены';
end $$;
rollback;
