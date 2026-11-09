import { formatPrice } from '../../shared/format'
import { useCart } from './CartContext'

export function CartSummary() {
  const { lines } = useCart()
  const total = lines.reduce((sum, line) => sum + line.snack.price * line.quantity, 0)

  return (
    <section className="cart" aria-label="Inhoud van je mandje">
      <h2>Mandje</h2>
      {lines.length === 0 && <p className="empty-state">Je mandje is nog leeg.</p>}
      {lines.map(({ snack, quantity }) => (
        <div key={snack.id} className="cart-line">
          <span className="cart-line__name">{snack.emoji} {snack.name}</span>
          <span className="cart-line__quantity">{quantity}</span>
        </div>
      ))}
      <div className="cart-total">
        <span>Totaal</span>
        <output aria-label="Totaal">{formatPrice(total)}</output>
      </div>
    </section>
  )
}
