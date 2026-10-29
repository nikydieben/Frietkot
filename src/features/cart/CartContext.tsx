import { createContext, use, useState, type ReactNode } from 'react'
import type { Snack } from '../../shared/api/snacks'
import { addSnack, removeOne } from './cartLines'
import type { CartLine } from './types'

type CartValue = {
  lines: CartLine[]
  add: (snack: Snack) => void
  removeOne: (snackId: string) => void
}

const CartContext = createContext<CartValue | null>(null)

/** Het mandje voor de hele app. Alles binnen <CartProvider> kan het mandje gebruiken. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const value: CartValue = {
    lines,
    add: snack => setLines(current => addSnack(current, snack)),
    removeOne: snackId => setLines(current => removeOne(current, snackId)),
  }

  return <CartContext value={value}>{children}</CartContext>
}

/** Haalt het mandje op, in elk component binnen de CartProvider. */
export function useCart(): CartValue {
  const cart = use(CartContext)
  if (!cart) throw new Error('useCart werkt enkel binnen een CartProvider')
  return cart
}
