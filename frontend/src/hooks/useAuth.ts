import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '../lib/supabase'

export type AuthState =
  | { status: 'checking' }
  | { status: 'guest'; error?: string }
  | { status: 'authenticated'; session: Session }

const fromSession = (session: Session | null): AuthState => session
  ? { status: 'authenticated', session } : { status: 'guest' }

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({ status: 'checking' })
  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined
    // Callback синхронный: никаких запросов внутри события Auth.
    void Promise.resolve().then(async () => {
      if (!active) return
      const client = getSupabase()
      const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
        if (active) setAuth(fromSession(session))
      })
      unsubscribe = () => subscription.unsubscribe()
      const { data, error } = await client.auth.getSession()
      if (!active) return
      setAuth(current => current.status === 'checking'
        ? error ? { status: 'guest', error: error.message } : fromSession(data.session)
        : current)
    }).catch((error: unknown) => {
      if (active) setAuth({ status: 'guest', error: error instanceof Error ? error.message : 'Не удалось проверить вход.' })
    })
    return () => { active = false; unsubscribe?.() }
  }, [])
  return auth
}
