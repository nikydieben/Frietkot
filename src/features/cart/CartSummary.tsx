import { formatPrice } from '../../shared/format'
import { useCart } from './CartContext'

export function CartSummary() {
  const { lines, add, removeOne } = useCart()
  const total = lines.reduce((sum, line) => sum + line.snack.price * line.quantity, 0)

  return (
    <section className="cart" aria-label="Inhoud van je mandje">
      {lines.length === 0 && <p className="empty-state">Je mandje is nog leeg.</p>}
      {lines.map(({ snack, quantity }) => (
        <div key={snack.id} className="cart-line">
          <span className="cart-line__name">{snack.emoji} {snack.name}</span>
          <button type="button" className="button" aria-label={`Eén ${snack.name} minder`} onClick={() => removeOne(snack.id)}>−</button>
          <span className="cart-line__quantity">{quantity}</span>
          <button type="button" className="button" aria-label={`Eén ${snack.name} meer`} onClick={() => add(snack)}>+</button>
        </div>
      ))}
      <div className="cart-total">
        <span>Totaal</span>
        <output aria-label="Totaal">{formatPrice(total)}</output>
      </div>
    </section>
  )
}
