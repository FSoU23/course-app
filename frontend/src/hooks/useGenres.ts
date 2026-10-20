import { useEffect, useState } from 'react'
import { getGenres } from '../services/genres'
import type { Genre } from '../types/genre'

type GenresLoad =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Genre[] }

export function useGenres() {
  const [load, setLoad] = useState<GenresLoad>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    // loading уже задан при создании хука или в retry; черновик формы не трогаем.

    getGenres(controller.signal)
      .then((data) => {
        if (active) setLoad({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (!active) return
        const message = error instanceof TypeError
          ? 'Не удалось загрузить жанры. Проверьте соединение и повторите попытку.'
          : error instanceof Error ? error.message : 'Не удалось загрузить справочник жанров.'
        setLoad({ status: 'error', message })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  function retry() {
    setLoad({ status: 'loading' })
    setAttempt((current) => current + 1)
  }

  return { load, retry }
}
