import { getSupabase } from '../lib/supabase'
import type { Book, BookDraft } from '../types/book'

type BookRow = {
  id: string
  owner_id: string
  genre_id: string
  title: string
  author: string
  description: string
  status: Book['status']
  rating: Book['rating']
  note: string
  added_at: string
  created_at: string
}
const columns = 'id, owner_id, genre_id, title, author, description, status, rating, note, added_at, created_at'

function fromRow(row: BookRow): Book {
  return {
    id: row.id, genre: row.genre_id, title: row.title, author: row.author,
    description: row.description, status: row.status, rating: row.rating,
    note: row.note, addedAt: row.added_at,
  }
}

// Владелец и id задаются базой, а не полями формы.
function toWrite(draft: BookDraft) {
  return {
    title: draft.title.trim(), author: draft.author.trim(), genre_id: draft.genre,
    description: draft.description.trim(), status: draft.status, rating: draft.rating,
    note: draft.note.trim(), added_at: draft.addedAt,
  }
}

export async function getBooks(signal: AbortSignal): Promise<Book[]> {
  const { data, error } = await getSupabase().from('books').select(columns)
    .order('created_at', { ascending: false }).order('id').abortSignal(signal)
    .overrideTypes<BookRow[], { merge: false }>()
  if (error) throw new Error(`Не удалось загрузить книги: ${error.message}`)
  return data.map(fromRow)
}

export async function createBook(draft: BookDraft): Promise<Book> {
  const { data, error } = await getSupabase().from('books').insert(toWrite(draft))
    .select(columns).single().overrideTypes<BookRow, { merge: false }>()
  if (error) throw new Error(`Не удалось создать книгу: ${error.message}`)
  return fromRow(data)
}

export async function updateBook(id: string, draft: BookDraft): Promise<Book> {
  const { data, error } = await getSupabase().from('books').update(toWrite(draft)).eq('id', id)
    .select(columns).maybeSingle().overrideTypes<BookRow | null, { merge: false }>()
  if (error) throw new Error(`Не удалось изменить книгу: ${error.message}`)
  if (!data) throw new Error('Книга недоступна или уже удалена. Обновите коллекцию.')
  return fromRow(data)
}

export async function deleteBook(id: string): Promise<void> {
  const { data, error } = await getSupabase().from('books').delete().eq('id', id).select('id')
  if (error) throw new Error(`Не удалось удалить книгу: ${error.message}`)
  if (!data?.length) throw new Error('Книга недоступна или уже удалена. Обновите коллекцию.')
}
