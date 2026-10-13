import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { bookStatusLabels } from '../types/book'
import type { BookDraft, BookRating } from '../types/book'

type BookFormProps = {
  initialValues: BookDraft
  onSave: (draft: BookDraft) => void
  onCancel: () => void
}

// Строка сохраняет пустой ввод оценки, не превращая его в 0.
type FormDraft = Omit<BookDraft, 'rating'> & { rating: string }
type FormErrors = Partial<Record<keyof FormDraft, string>>

function isBookRating(value: number): value is BookRating {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 1 && value <= 5
}

export function BookForm({ initialValues, onSave, onCancel }: BookFormProps) {
  const [draft, setDraft] = useState<FormDraft>(() => ({
    ...initialValues, rating: initialValues.rating === null ? '' : String(initialValues.rating),
  }))
  const [errors, setErrors] = useState<FormErrors>({})
  const ratingInput = useRef<HTMLInputElement>(null)

  function changeField<K extends keyof FormDraft>(field: K, value: FormDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    const title = draft.title.trim()
    const author = draft.author.trim()
    if (title.length < 3 || title.length > 100) {
      nextErrors.title = 'Название должно содержать от 3 до 100 символов без пробелов по краям.'
    }
    if (!author) nextErrors.author = 'Укажите автора книги.'
    if (!draft.addedAt) nextErrors.addedAt = 'Укажите дату добавления книги.'

    let rating: BookRating | null = null
    if (ratingInput.current?.validity.badInput) {
      nextErrors.rating = 'Оценка должна быть целым числом от 1 до 5 или оставаться пустой.'
    } else if (draft.rating.trim() !== '') {
      const number = Number(draft.rating)
      if (isBookRating(number)) rating = number
      else nextErrors.rating = 'Оценка должна быть целым числом от 1 до 5 или оставаться пустой.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0]
      const control = event.currentTarget.elements.namedItem(`book-${firstField}`)
      if (control instanceof HTMLElement) control.focus()
      return
    }

    onSave({
      ...draft, title, author, genre: draft.genre.trim(),
      description: draft.description.trim(), note: draft.note.trim(), rating,
    })
  }

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <p className="form-hint">* Обязательные поля. Остальное можно заполнить позже.</p>
      {Object.values(errors).some(Boolean) && <p className="form-error-summary" role="alert">Книга не сохранена. Исправьте отмеченные поля — введённые данные остались в форме.</p>}
      <div className="form-grid">
        <div className="form-field form-field-wide">
          <label htmlFor="book-title">Название *</label>
          <input id="book-title" name="book-title" value={draft.title} required aria-invalid={Boolean(errors.title)} aria-describedby="title-hint title-error" onChange={(event) => changeField('title', event.target.value)} />
          <span id="title-hint" className="field-hint">От 3 до 100 символов.</span>
          <span id="title-error" className="field-error">{errors.title}</span>
        </div>
        <div className="form-field">
          <label htmlFor="book-author">Автор *</label>
          <input id="book-author" name="book-author" value={draft.author} required aria-invalid={Boolean(errors.author)} aria-describedby="author-error" onChange={(event) => changeField('author', event.target.value)} />
          <span id="author-error" className="field-error">{errors.author}</span>
        </div>
        <div className="form-field">
          <label htmlFor="book-genre">Жанр</label>
          <input id="book-genre" value={draft.genre} onChange={(event) => changeField('genre', event.target.value)} />
        </div>
        <div className="form-field form-field-wide">
          <label htmlFor="book-description">Описание</label>
          <textarea id="book-description" rows={4} value={draft.description} onChange={(event) => changeField('description', event.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="book-status">Статус чтения</label>
          <select id="book-status" value={draft.status} onChange={(event) => {
            const status = event.target.value
            if (status === 'planned' || status === 'reading' || status === 'finished') changeField('status', status)
          }}>
            <option value="planned">{bookStatusLabels.planned}</option>
            <option value="reading">{bookStatusLabels.reading}</option>
            <option value="finished">{bookStatusLabels.finished}</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="book-rating">Оценка</label>
          <input ref={ratingInput} id="book-rating" name="book-rating" type="number" min="1" max="5" step="1" value={draft.rating} aria-invalid={Boolean(errors.rating)} aria-describedby="rating-hint rating-error" onChange={(event) => changeField('rating', event.target.value)} />
          <span id="rating-hint" className="field-hint">Целое число от 1 до 5. Оставьте пустым, если оценки пока нет.</span>
          <span id="rating-error" className="field-error">{errors.rating}</span>
        </div>
        <div className="form-field">
          <label htmlFor="book-addedAt">Дата добавления *</label>
          <input id="book-addedAt" name="book-addedAt" type="date" value={draft.addedAt} required aria-invalid={Boolean(errors.addedAt)} aria-describedby="date-error" onChange={(event) => changeField('addedAt', event.target.value)} />
          <span id="date-error" className="field-error">{errors.addedAt}</span>
        </div>
        <div className="form-field form-field-wide">
          <label htmlFor="book-note">Личная заметка</label>
          <textarea id="book-note" rows={4} value={draft.note} onChange={(event) => changeField('note', event.target.value)} />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">Сохранить книгу</button>
        <button type="button" className="button-secondary" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  )
}
