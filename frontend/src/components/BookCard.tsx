import { Link } from 'react-router'
import { bookStatusLabels } from '../types/book'
import type { Book } from '../types/book'

type BookCardProps = { book: Book }

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="book-card">
      <span className={`status status-${book.status}`}>{bookStatusLabels[book.status]}</span>
      <h2><Link to={`/books/${book.id}`}>{book.title}</Link></h2>
      <p className="book-author">{book.author} · {book.genre}</p>
      <p>{book.description}</p>
      <p className="book-rating">Оценка: {book.rating === null ? 'Пока нет оценки' : `${book.rating} из 5`}</p>
    </article>
  )
}
