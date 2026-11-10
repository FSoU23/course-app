-- Можно запускать повторно: стабильные id не меняются.
insert into public.genres (id, name) values
  ('science-fiction', 'Научная фантастика'),
  ('adventure', 'Приключения'),
  ('fantasy', 'Фэнтези'),
  ('detective', 'Детектив'),
  ('nonfiction', 'Познавательная проза'),
  ('novel', 'Роман в прозе'),
  ('poetry', 'Поэзия')
on conflict (id) do update set name = excluded.name;
