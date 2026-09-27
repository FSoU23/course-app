export type BookStatus = 'planned' | 'reading' | 'finished'
export type BookRating = 1 | 2 | 3 | 4 | 5

export type Book = {
  id: string
  title: string
  author: string
  genre: string
  description: string
  status: BookStatus
  rating: BookRating | null
  note: string
  addedAt: string
}

export const bookStatusLabels: Record<BookStatus, string> = {
  planned: 'Запланировано',
  reading: 'Читаю',
  finished: 'Прочитано',
}
