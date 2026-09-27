import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { BooksPage } from './pages/BooksPage'
import { BookDetailsPage } from './pages/BookDetailsPage'
import { NewBookPage } from './pages/NewBookPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/new" element={<NewBookPage />} />
        <Route path="books/:id" element={<BookDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
