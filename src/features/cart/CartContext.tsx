import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import type { Snack } from '../../shared/api/snacks'
import { addSnack, removeOne } from './cartLines'
import type { CartLine } from './types'

type CartValue = {
  lines: CartLine[]
  add: (snack: Snack) => void
  removeOne: (snackId: string) => void
  clear: () => void
}

const CartContext = createContext<CartValue | null>(null)

const STORAGE_KEY = 'frietkot.mandje'

/** Het bewaarde mandje, of een leeg mandje als er niets (leesbaars) bewaard is. */
function loadLines(): CartLine[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? (parsed as CartLine[]) : []
  } catch {
    return []
  }
}

/** Het mandje voor de hele app. Alles binnen <CartProvider> kan het mandje gebruiken. */
export function CartProvider({ children }: { children: ReactNode }) {
  // Een functie als beginwaarde: React leest localStorage enkel bij de eerste render.
  const [lines, setLines] = useState<CartLine[]>(loadLines)

  // Synchroniseren met de buitenwereld: na elke render waarin lines veranderde.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines])

  const value: CartValue = {
    lines,
    add: snack => setLines(current => addSnack(current, snack)),
    removeOne: snackId => setLines(current => removeOne(current, snackId)),
    clear: () => setLines([]),
  }

  return <CartContext value={value}>{children}</CartContext>
}

/** Haalt het mandje op, in elk component binnen de CartProvider. */
export function useCart(): CartValue {
  const cart = use(CartContext)
  if (!cart) throw new Error('useCart werkt enkel binnen een CartProvider')
  return cart
}
