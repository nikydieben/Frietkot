import { Link } from 'react-router'
import { formatPrice } from '../../shared/format'
import { useCart } from '../cart/CartContext'
import { useSnacks } from './useSnacks'

export function SnackDetailPage() {
  // STAP 4: haal de id uit de URL in plaats van deze vaste waarde: const { id } = useParams()
  const id = 'friet-groot'
  const { status, data: snacks } = useSnacks()
  const { add } = useCart()

  if (status !== 'success') return <p className="state state--loading">Snack laden…</p>

  const snack = snacks.find(s => s.id === id)

  // STAP 4: bestaat de snack niet (snack is undefined)? Toon dan "Snack niet gevonden"
  //         met een <Link to="/">Terug naar het menu</Link>
  if (!snack) return null

  return (
    <article className="detail">
      <span className="detail__emoji" aria-hidden="true">{snack.emoji}</span>
      <div>
        <h1>{snack.name}</h1>
        <p>{formatPrice(snack.price)} · {snack.category}</p>
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
