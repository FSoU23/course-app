import { Link } from 'react-router'
import { BookCard } from '../components/BookCard'
import { books } from '../data/books'

export function BooksPage() {
  return (
    <section className="app-section">
      <div className="section-heading">
        <div><h1>Моя коллекция</h1><p>Книги, к которым хочется возвращаться.</p></div>
        <Link className="button-link" to="/books/new">Добавить книгу</Link>
      </div>
      {books.length === 0 ? (
        <p className="empty-state">Книг пока нет. Здесь появится ваша коллекция.</p>
      ) : (
        <div className="book-list">
          {books.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </section>
  )
}
