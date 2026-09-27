import { Link } from 'react-router'

export function NewBookPage() {
  return (
    <section className="app-section">
      <h1>Создание книги</h1>
      <div className="empty-state">
        <h2>Место для вашей следующей книги</h2>
        <p>Форма добавления книги появится в лабораторной работе № 3. Сейчас можно посмотреть демонстрационную коллекцию и подробности каждой книги.</p>
      </div>
      <Link to="/books">К списку книг</Link>
    </section>
  )
}
