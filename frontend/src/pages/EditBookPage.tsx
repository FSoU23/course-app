import { Link, useNavigate, useParams } from 'react-router'
import { BookForm } from '../components/BookForm'
import type { Book, BookDraft } from '../types/book'

type EditBookPageProps = {
  books: Book[]
  onUpdate: (id: string, draft: BookDraft) => void
}

export function EditBookPage({ books, onUpdate }: EditBookPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const book = books.find((item) => item.id === id)

  if (!book) {
    return (
      <section className="app-section">
        <h1>Книга не найдена</h1>
        <p className="empty-state">Этой книги нет в коллекции. Выберите другую книгу для редактирования.</p>
        <Link to="/books">К списку книг</Link>
      </section>
    )
  }

  const initialValues: BookDraft = {
    title: book.title, author: book.author, genre: book.genre,
    description: book.description, status: book.status, rating: book.rating,
    note: book.note, addedAt: book.addedAt,
  }

  return (
    <section className="app-section">
      <Link to={`/books/${book.id}`}>← К книге</Link>
      <h1>Редактировать книгу</h1>
      <p className="page-intro">Обновите детали или оставьте впечатления от прочитанного.</p>
      <BookForm key={book.id} initialValues={initialValues} onSave={(draft) => {
        onUpdate(book.id, draft)
        navigate(`/books/${book.id}`)
      }} onCancel={() => navigate(`/books/${book.id}`)} />
    </section>
  )
}
