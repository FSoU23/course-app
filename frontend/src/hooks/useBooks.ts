import { useEffect, useRef, useState } from 'react'
import * as api from '../services/books'
import type { Book, BookDraft } from '../types/book'

// Этот хук живёт в компоненте с key=user.id: при выходе/смене пользователя
// весь личный список уничтожается, новая сессия начинает с пустого массива.
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const alive = useRef(false)
  const request = useRef<AbortController | null>(null)

  async function reload(initial = false) {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setRefreshing(true); setError('')
    try {
      const data = await api.getBooks(controller.signal)
      if (!alive.current || controller.signal.aborted) return
      setBooks(data)
      setStatus('success')
    } catch (err: unknown) {
      if (!alive.current || controller.signal.aborted) return
      setError(err instanceof Error ? err.message : 'Не удалось обновить коллекцию.')
      if (initial) setStatus('error')
    } finally {
      if (alive.current && !controller.signal.aborted) setRefreshing(false)
    }
  }

  useEffect(() => {
    alive.current = true
    const controller = new AbortController()
    request.current = controller
    void api.getBooks(controller.signal).then(data => {
      if (controller.signal.aborted) return
      setBooks(data); setStatus('success')
    }).catch((err: unknown) => {
      if (controller.signal.aborted) return
      setError(err instanceof Error ? err.message : 'Не удалось загрузить книги.')
      setStatus('error')
    })
    return () => { alive.current = false; controller.abort(); request.current?.abort() }
  }, [])

  function checkActive() {
    if (!alive.current) throw new Error('Сессия изменилась. Откройте коллекцию заново.')
  }

  async function createBook(draft: BookDraft): Promise<string> {
    const book = await api.createBook(draft)
    checkActive()
    setBooks(current => [book, ...current])
    // Запись уже сохранена. Ошибка повторного чтения не должна провоцировать
    // второй INSERT: показываем её отдельно и предлагаем обновить список.
    await reload()
    checkActive()
    return book.id
  }
  async function updateBook(id: string, draft: BookDraft): Promise<void> {
    const book = await api.updateBook(id, draft)
    checkActive()
    setBooks(current => current.map(item => item.id === id ? book : item))
    await reload()
    checkActive()
  }
  async function deleteBook(id: string): Promise<void> {
    await api.deleteBook(id)
    checkActive()
    setBooks(current => current.filter(item => item.id !== id))
    await reload()
    checkActive()
  }
  return { books, status, error, refreshing, retry: () => reload(status !== 'success'), createBook, updateBook, deleteBook }
}
