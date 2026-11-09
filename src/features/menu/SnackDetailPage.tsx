import { Link, useParams } from 'react-router'
import { formatPrice } from '../../shared/format'
import { useCart } from '../cart/CartContext'
import { useSnacks } from './useSnacks'

export function SnackDetailPage() {
  const { id } = useParams()
  // Zelfde query als het menu: de snacks staan al in de cache, dus je ziet ze meteen.
  const { status, data: snacks, error } = useSnacks()
  const { add } = useCart()

  if (status === 'pending') return <p className="state state--loading">Snack laden…</p>
  if (status === 'error') return <p className="state state--error" role="alert">{error.message}</p>

  const snack = snacks.find(s => s.id === id)
  if (!snack) {
    return (
      <section className="empty-state">
        <h1>Snack niet gevonden</h1>
        <p>Die snack staat niet op ons menu.</p>
        <Link to="/">Terug naar het menu</Link>
      </section>
    )
  }

  return (
    <article className="detail">
      <span className="detail__emoji" aria-hidden="true">{snack.emoji}</span>
      <div>
        <h1>{snack.name}</h1>
        <p>{formatPrice(snack.price)} · {snack.category}</p>
        {snack.vegetarian && <p className="tag-veggie">vegetarisch</p>}
        <p>
          <button type="button" className="button button--primary" onClick={() => add(snack)}>
            Toevoegen aan mandje
          </button>
        </p>
        <Link to="/">← Terug naar het menu</Link>
      </div>
    </article>
  )
}
