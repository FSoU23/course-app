import { Link, useParams } from 'react-router'
import { books } from '../data/books'
import { bookStatusLabels } from '../types/book'

export function BookDetailsPage() {
  const { id } = useParams()
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
      <p className="details-description">{book.description}</p>
      <dl className="book-details">
        <div><dt>Автор</dt><dd>{book.author}</dd></div>
        <div><dt>Жанр</dt><dd>{book.genre}</dd></div>
        <div><dt>Статус чтения</dt><dd><span className={`status status-${book.status}`}>{bookStatusLabels[book.status]}</span></dd></div>
        <div><dt>Оценка</dt><dd>{book.rating === null ? 'Пока нет оценки' : `${book.rating} из 5`}</dd></div>
        <div><dt>Дата добавления</dt><dd><time dateTime={book.addedAt}>{book.addedAt.split('-').reverse().join('.')}</time></dd></div>
      </dl>
      <h2>Личная заметка</h2>
      <p className="note">{book.note}</p>
    </section>
  )
}
