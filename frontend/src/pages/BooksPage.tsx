import { useState } from 'react'
import { Link } from 'react-router'
import { BookCard } from '../components/BookCard'
import { bookStatusLabels } from '../types/book'
import type { Book, BookStatus } from '../types/book'

type BooksPageProps = { books: Book[] }

export function BooksPage({ books }: BooksPageProps) {
  const [status, setStatus] = useState<BookStatus | 'all'>('all')
  const visibleBooks = books.filter((book) => status === 'all' || book.status === status)

  return (
    <section className="app-section">
      <div className="section-heading">
        <div><h1>Моя коллекция</h1><p>Книги, к которым хочется возвращаться.</p></div>
        <Link className="button-link" to="/books/new">Добавить книгу</Link>
      </div>
      <div className="filter-bar">
        <div className="filter-field">
          <label htmlFor="status-filter">Статус чтения</label>
          <select id="status-filter" value={status} onChange={(event) => {
            const value = event.target.value
            if (value === 'all' || value === 'planned' || value === 'reading' || value === 'finished') {
              setStatus(value)
            }
          }}>
            <option value="all">Все книги</option>
            <option value="planned">{bookStatusLabels.planned}</option>
            <option value="reading">{bookStatusLabels.reading}</option>
            <option value="finished">{bookStatusLabels.finished}</option>
          </select>
        </div>
        <button type="button" className="button-secondary" onClick={() => setStatus('all')} disabled={status === 'all'}>Сбросить фильтр</button>
        <p className="collection-count" role="status">Показано: {visibleBooks.length} из {books.length}</p>
      </div>
      {books.length === 0 ? (
        <div className="empty-state"><h2>Книг пока нет</h2><p>Начните свою коллекцию с первой истории.</p><Link to="/books/new">Добавить первую книгу →</Link></div>
      ) : visibleBooks.length === 0 ? (
        <div className="empty-state"><h2>Нет книг с таким статусом</h2><p>Выберите другой статус или сбросьте фильтр, чтобы увидеть всю коллекцию.</p></div>
      ) : (
        <div className="book-list">
          {visibleBooks.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </section>
  )
}
