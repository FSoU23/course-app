import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined

// Создаём один клиент при первом запросе. Ошибку настройки сможет показать хук.
export function getSupabase(): SupabaseClient {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!url || !key || key === 'sb_publishable_your_key') {
    throw new Error('Подключение к базе не настроено. Заполните frontend/.env.local и перезапустите сайт.')
  }
  if (!key.startsWith('sb_publishable_')) {
    throw new Error('Для сайта нужен публичный ключ Supabase, начинающийся с sb_publishable_.')
  }
  client = createClient(url, key)
  return client
}
