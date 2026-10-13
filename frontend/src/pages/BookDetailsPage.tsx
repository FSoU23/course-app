import { Link, useNavigate, useParams } from 'react-router'
import { bookStatusLabels } from '../types/book'
import type { Book } from '../types/book'

type BookDetailsPageProps = { books: Book[]; onDelete: (id: string) => void }

export function BookDetailsPage({ books, onDelete }: BookDetailsPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const book = books.find((item) => item.id === id)

  if (!book) {
    return (
      <section className="app-section">
        <h1>Книга не найдена</h1>
        <p className="empty-state">В коллекции нет книги с таким идентификатором. Выберите книгу из списка.</p>
        <Link to="/books">К списку книг</Link>
      </section>
    )
  }

  return (
    <section className="app-section">
      <Link to="/books">← К списку книг</Link>
      <h1>{book.title}</h1>
      <p className="details-description">{book.description || 'Описание пока не добавлено.'}</p>
      <dl className="book-details">
        <div><dt>Автор</dt><dd>{book.author}</dd></div>
        <div><dt>Жанр</dt><dd>{book.genre}</dd></div>
        <div><dt>Статус чтения</dt><dd><span className={`status status-${book.status}`}>{bookStatusLabels[book.status]}</span></dd></div>
        <div><dt>Оценка</dt><dd>{book.rating === null ? 'Пока нет оценки' : `${book.rating} из 5`}</dd></div>
        <div><dt>Дата добавления</dt><dd><time dateTime={book.addedAt}>{book.addedAt.split('-').reverse().join('.')}</time></dd></div>
      </dl>
      <h2>Личная заметка</h2>
      <p className="note">{book.note || 'Здесь появятся ваши впечатления о книге.'}</p>
      <div className="page-actions">
        <Link className="button-link" to={`/books/${book.id}/edit`}>Редактировать</Link>
        <button type="button" className="button-danger" onClick={() => {
          if (window.confirm(`Удалить книгу «${book.title}»?`)) {
            onDelete(book.id)
            navigate('/books', { replace: true })
          }
        }}>Удалить книгу</button>
      </div>
    </section>
  )
}
