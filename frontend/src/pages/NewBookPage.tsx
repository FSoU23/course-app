import { Link, useNavigate } from 'react-router'
import { BookForm } from '../components/BookForm'
import type { BookDraft } from '../types/book'

const emptyBook: BookDraft = {
  title: '', author: '', genre: '', description: '', status: 'planned',
  rating: null, note: '', addedAt: '',
}

type NewBookPageProps = { onCreate: (draft: BookDraft) => string }

export function NewBookPage({ onCreate }: NewBookPageProps) {
  const navigate = useNavigate()

  return (
    <section className="app-section">
      <Link to="/books">← К списку книг</Link>
      <h1>Добавить книгу</h1>
      <p className="page-intro">В каждой книге — новая история. Сохраните ту, которую хочется прочитать.</p>
      <BookForm initialValues={emptyBook} onSave={(draft) => {
        const id = onCreate(draft)
        navigate(`/books/${id}`)
      }} onCancel={() => navigate('/books')} />
    </section>
  )
}
