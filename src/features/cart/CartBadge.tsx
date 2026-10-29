import { useCart } from './CartContext'

export function CartBadge() {
  const { lines } = useCart()
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <span className="cart-badge" aria-label={`${count} items in je mandje`}>
      🛒 {count}
    </span>
  )
}
