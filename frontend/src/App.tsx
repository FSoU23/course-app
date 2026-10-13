import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { books as initialBooks } from './data/books'
import type { Book, BookDraft } from './types/book'
import { AppLayout } from './app/AppLayout'
import { BooksPage } from './pages/BooksPage'
import { BookDetailsPage } from './pages/BookDetailsPage'
import { NewBookPage } from './pages/NewBookPage'
import { EditBookPage } from './pages/EditBookPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => initialBooks.map((book) => ({ ...book })))

  function createBook(draft: BookDraft): string {
    const id = crypto.randomUUID()
    setBooks((current) => [...current, { ...draft, id }])
    return id
  }

  function updateBook(id: string, draft: BookDraft): void {
    setBooks((current) => current.map((book) => book.id === id ? { ...draft, id: book.id } : book))
  }

  function deleteBook(id: string): void {
    setBooks((current) => current.filter((book) => book.id !== id))
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="books" element={<BooksPage books={books} />} />
        <Route path="books/new" element={<NewBookPage onCreate={createBook} />} />
        <Route path="books/:id" element={<BookDetailsPage books={books} onDelete={deleteBook} />} />
        <Route path="books/:id/edit" element={<EditBookPage books={books} onUpdate={updateBook} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
