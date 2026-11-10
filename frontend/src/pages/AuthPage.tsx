import { useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import { Navigate } from 'react-router'
import type { AuthState } from '../hooks/useAuth'
import { getSupabase } from '../lib/supabase'

export function AuthPage({ auth }: { auth: AuthState }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const busy = useRef(false)

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy.current) return
    setError(''); setMessage('')
    if (mode === 'register' && password.length < 8) {
      setError('Придумайте пароль длиной не менее 8 символов.')
      return
    }
    busy.current = true
    setPending(true)
    try {
      const client = getSupabase()
      if (mode === 'register') {
        const { data, error: signupError } = await client.auth.signUp({
          email: email.trim(), password, options: { emailRedirectTo: window.location.origin },
        })
        if (signupError) throw signupError
        if (!data.session) setMessage('Проверьте почту и подтвердите регистрацию по ссылке из письма. Затем вернитесь и войдите.')
      } else {
        const { error: loginError } = await client.auth.signInWithPassword({ email: email.trim(), password })
        if (loginError) throw loginError
      }
      setPassword('')
      setShowPassword(false)
      // Переход выполняется только после события Auth с настоящей сессией.
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не удалось выполнить вход. Повторите попытку.')
    } finally { busy.current = false; setPending(false) }
  }

  if (auth.status === 'checking') return <p role="status">Проверяем сессию…</p>
  if (auth.status === 'authenticated') return <Navigate to="/books" replace />
  return <section className="app-section auth-section">
    <h1>{mode === 'login' ? 'Вход в библиотеку' : 'Регистрация'}</h1>
    <p>Войдите, чтобы сохранять книги и видеть свою коллекцию на разных устройствах.</p>
    <form className="book-form" onSubmit={submit}>
      <fieldset disabled={pending} className="form-fields">
        <div className="form-grid">
          <div className="form-field form-field-wide">
            <label htmlFor="auth-email">Электронная почта</label>
            <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="auth-password">Пароль</label>
            <div className="password-control">
              <input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'register' ? 8 : undefined} value={password} onChange={event => setPassword(event.target.value)} />
              <button type="button" className="button-secondary" aria-controls="auth-password" aria-pressed={showPassword} onClick={() => setShowPassword(current => !current)}>{showPassword ? 'Скрыть пароль' : 'Показать пароль'}</button>
            </div>
            {mode === 'register' && <span className="field-hint">Не менее 8 символов. После регистрации проверьте почту.</span>}
          </div>
        </div>
        {(error || auth.error) && <p className="form-error-summary" role="alert">{error || auth.error}</p>}
        {message && <p className="reference-message" role="status">{message}</p>}
        <div className="form-actions">
          <button type="submit" disabled={pending}>{pending ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
          <button type="button" className="button-secondary" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage(''); setPassword(''); setShowPassword(false) }}>
            {mode === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт'}
          </button>
        </div>
      </fieldset>
    </form>
  </section>
}
