import './App.css'

const appTitle: string = 'Личная библиотека'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>{appTitle}</h1>
        <p className="app-subtitle">
          Учёт прочитанных и планируемых книг, статусы чтения и личные заметки.
        </p>
      </header>

      <main>
        <section className="app-section">
          <h2>Моя коллекция</h2>
          <p className="empty-state">
            Здесь появится список ваших книг, их статусы и заметки.
          </p>
        </section>
      </main>
    </div>
  )
}