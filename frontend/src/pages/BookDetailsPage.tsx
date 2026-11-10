import { Link, useNavigate, useParams } from 'react-router'
import { useRef, useState } from 'react'
import { bookStatusLabels } from '../types/book'
import type { Book } from '../types/book'
import { useGenres } from '../hooks/useGenres'

type BookDetailsPageProps = { books: Book[]; onDelete: (id: string) => Promise<void> }

export function BookDetailsPage({ books, onDelete }: BookDetailsPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const busy = useRef(false)
  const { load } = useGenres()
  const book = books.find((item) => item.id === id)
  const genres = load.status === 'success' ? load.data : []
  const genreName = genres.find((genre) => genre.id === book?.genre)?.name

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
        <div><dt>Жанр</dt><dd>{genreName ?? `Код: ${book.genre}`}</dd></div>
        <div><dt>Статус чтения</dt><dd><span className={`status status-${book.status}`}>{bookStatusLabels[book.status]}</span></dd></div>
        <div><dt>Оценка</dt><dd>{book.rating === null ? 'Пока нет оценки' : `${book.rating} из 5`}</dd></div>
        <div><dt>Дата добавления</dt><dd><time dateTime={book.addedAt}>{book.addedAt.split('-').reverse().join('.')}</time></dd></div>
      </dl>
      <h2>Личная заметка</h2>
      <p className="note">{book.note || 'Здесь появятся ваши впечатления о книге.'}</p>
      <div className="page-actions">
        <Link className="button-link" to={`/books/${book.id}/edit`}>Редактировать</Link>
        <button type="button" className="button-danger" disabled={pending} onClick={async () => {
          if (busy.current || !window.confirm(`Удалить книгу «${book.title}»?`)) return
          busy.current = true; setPending(true); setError('')
          try {
            await onDelete(book.id)
            navigate('/books', { replace: true })
          } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Не удалось удалить книгу.') }
          finally { busy.current = false; setPending(false) }
        }}>{pending ? 'Удаляем…' : 'Удалить книгу'}</button>
      </div>
      {error && <p role="alert" className="form-error-summary">{error}</p>}
    </section>
  )
}
