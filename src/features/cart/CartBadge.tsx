import { Link } from 'react-router'
import { itemCount } from './cart'
import { useCart } from './CartContext'

export function CartBadge() {
  const { lines } = useCart()
  const count = itemCount(lines)

  return (
    <Link to="/mandje" className="cart-badge" aria-label={`${count} items in je mandje`}>
      🛒 {count}
    </Link>
  )
}
