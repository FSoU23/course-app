begin;

alter table public.books alter column owner_id set default auth.uid();
alter table public.books enable row level security;
revoke all on table public.books from public, anon, authenticated;
grant select, insert, update, delete on table public.books to authenticated;

create policy "books select own" on public.books
for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = owner_id);

create policy "books insert own" on public.books
for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = owner_id);

create policy "books update own" on public.books
for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = owner_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = owner_id);

create policy "books delete own" on public.books
for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = owner_id);

commit;
