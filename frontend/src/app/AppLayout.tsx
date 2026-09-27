import { NavLink, Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">К содержимому</a>
      <header className="app-header">
        <p className="app-title">Личная библиотека</p>
        <p className="app-subtitle">Учёт прочитанных и планируемых книг, статусы чтения и личные заметки.</p>
        <nav aria-label="Основная навигация">
          <NavLink to="/books" end>Моя коллекция</NavLink>
          <NavLink to="/books/new">Добавить книгу</NavLink>
        </nav>
      </header>
      <main id="main" tabIndex={-1}><Outlet /></main>
      <footer className="app-footer">Учебная библиотека · Все книги и заметки вымышлены.</footer>
    </div>
  )
}
