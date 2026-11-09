begin;

create table public.genres (
  id text primary key check (id = btrim(id) and length(id) > 0),
  name text not null unique check (name = btrim(name) and length(name) > 0)
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (title = btrim(title) and char_length(title) between 3 and 100),
  author text not null check (author = btrim(author) and char_length(author) > 0),
  genre_id text not null references public.genres(id) on update cascade on delete restrict,
  description text not null default '',
  status text not null default 'planned' check (status in ('planned', 'reading', 'finished')),
  rating integer check (rating between 1 and 5),
  note text not null default '',
  added_at date not null,
  created_at timestamptz not null default now()
);

create index books_owner_id_idx on public.books(owner_id);
create index books_genre_id_idx on public.books(genre_id);

alter table public.genres enable row level security;
alter table public.books enable row level security;
revoke all on public.genres, public.books from public, anon, authenticated;
grant select on public.genres to anon, authenticated;
create policy genres_read on public.genres for select to anon, authenticated using (true);

-- Личные книги закрыты до лабораторной работы с авторизацией.
commit;
