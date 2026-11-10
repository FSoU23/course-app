begin;

-- Общий справочник жанров доступен всем пользователям приложения.
create table public.genres (
  -- ID используется в форме и связях
  id text primary key check (id = btrim(id) and length(id) > 0),
  -- Названия обязательны, уникальны и не могут содержать пробелы по краям.
  name text not null unique check (name = btrim(name) and length(name) > 0)
);

-- Таблица личных книг. Доступ к ней будет настроен после добавления авторизации.
create table public.books (
  id uuid primary key default gen_random_uuid(),
  -- При удалении пользователя Supabase удаляются и его книги.
  owner_id uuid not null references auth.users(id) on delete cascade,
  -- Название должно быть от 3 до 100 символов без пробелов по краям.
  title text not null check (title = btrim(title) and char_length(title) between 3 and 100),
  -- Автор обязателен и не может быть пустым или иметь пробелы по краям.
  author text not null check (author = btrim(author) and char_length(author) > 0),
  -- Жанр должен существовать; при удалении используемого жанра операция запрещена.
  genre_id text not null references public.genres(id) on update cascade on delete restrict,
  -- Необязательные текстовые поля по умолчанию пусты.
  description text not null default '',
  -- Статус ограничен тремя поддерживаемыми значениями.
  status text not null default 'planned' check (status in ('planned', 'reading', 'finished')),
  -- Оценка необязательна; если задана, допустимы только целые значения от 1 до 5.
  rating integer check (rating between 1 and 5),
  note text not null default '',
  -- Дата добавления задаётся приложением.
  added_at date not null,
  -- Время создания заполняется базой автоматически.
  created_at timestamptz not null default now()
);

-- Индексы ускоряют поиск книг пользователя и по жанру.
create index books_owner_id_idx on public.books(owner_id);
create index books_genre_id_idx on public.books(genre_id);

alter table public.genres enable row level security;
alter table public.books enable row level security;
-- Сначала отзываем все клиентские права, затем открываем только чтение жанров.
revoke all on public.genres, public.books from public, anon, authenticated;
grant select on public.genres to anon, authenticated;
create policy genres_read on public.genres for select to anon, authenticated using (true);

-- Личные книги закрыты до лабораторной работы с авторизацией.
-- У таблицы books намеренно нет клиентских прав и политик RLS.
commit;
