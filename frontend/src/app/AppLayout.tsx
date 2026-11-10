import { NavLink, Outlet } from 'react-router'
import { useRef, useState } from 'react'
import type { AuthState } from '../hooks/useAuth'
import { getSupabase } from '../lib/supabase'

export function AppLayout({ auth }: { auth: AuthState }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const busy = useRef(false)
  async function signOut() {
    if (busy.current) return
    busy.current = true; setPending(true); setError('')
    try {
      const { error } = await getSupabase().auth.signOut({ scope: 'local' })
      if (error) throw error
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Не удалось выйти.') }
    finally { busy.current = false; setPending(false) }
  }
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
        {auth.status === 'authenticated' && <div className="account-bar">
          <span>{auth.session.user.email}</span>
          <button disabled={pending} className="button-secondary" onClick={() => void signOut()}>{pending ? 'Выходим…' : 'Выйти'}</button>
        </div>}
        {error && <p role="alert">{error}</p>}
      </header>
      {auth.status === 'authenticated' && <p className="storage-notice">Книги сохраняются в вашей личной коллекции и доступны после повторного входа.</p>}
      <main id="main" tabIndex={-1}><Outlet /></main>
      <footer className="app-footer">Личная библиотека · Маленькое место для больших историй.</footer>
    </div>
  )
}
