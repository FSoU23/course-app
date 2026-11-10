import { Navigate, Outlet, Route, Routes, useOutletContext } from 'react-router'
import { useAuth } from './hooks/useAuth'
import { useBooks } from './hooks/useBooks'
import { RequireAuth } from './app/RequireAuth'
import { AuthPage } from './pages/AuthPage'
import { AppLayout } from './app/AppLayout'
import { BooksPage } from './pages/BooksPage'
import { BookDetailsPage } from './pages/BookDetailsPage'
import { NewBookPage } from './pages/NewBookPage'
import { EditBookPage } from './pages/EditBookPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

function Library() {
  const library = useBooks()
  if (library.status !== 'success') return <section className="app-section">
    {library.refreshing || library.status === 'loading' ? <p role="status">Загружаем книги…</p> : <>
      <p role="alert">{library.error}</p>
      <button onClick={() => void library.retry()}>Повторить загрузку</button>
    </>}
  </section>
  return <>
    {library.error && <div className="reference-message" role="alert">
      <p>{library.error} Показана последняя полученная коллекция. Если книга была сохранена, повторять сохранение не нужно.</p>
      <button disabled={library.refreshing} onClick={() => void library.retry()}>Обновить коллекцию</button>
    </div>}
    <Outlet context={library} />
  </>
}
type LibraryContext = ReturnType<typeof useBooks>
function ListRoute() { const { books } = useOutletContext<LibraryContext>(); return <BooksPage books={books} /> }
function NewRoute() { const { createBook } = useOutletContext<LibraryContext>(); return <NewBookPage onCreate={createBook} /> }
function EditRoute() { const { books, updateBook } = useOutletContext<LibraryContext>(); return <EditBookPage books={books} onUpdate={updateBook} /> }
function DetailsRoute() { const { books, deleteBook } = useOutletContext<LibraryContext>(); return <BookDetailsPage books={books} onDelete={deleteBook} /> }

export default function App() {
  const auth = useAuth()
  return (
    <Routes>
      <Route element={<AppLayout auth={auth} />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="auth" element={<AuthPage auth={auth} />} />
        <Route element={<RequireAuth auth={auth} />}>
          <Route element={auth.status === 'authenticated' ? <Library key={auth.session.user.id} /> : null}>
            <Route path="books" element={<ListRoute />} />
            <Route path="books/new" element={<NewRoute />} />
            <Route path="books/:id" element={<DetailsRoute />} />
            <Route path="books/:id/edit" element={<EditRoute />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
