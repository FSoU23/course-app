import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="app-section">
      <h1>Страница не найдена</h1>
      <p className="empty-state">Такого адреса в приложении нет. Проверьте ссылку или вернитесь в коллекцию.</p>
      <Link to="/books">К списку книг</Link>
    </section>
  )
}
