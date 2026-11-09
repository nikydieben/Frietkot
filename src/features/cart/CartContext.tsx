import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import type { Snack } from '../../shared/api/snacks'
import { addSnack, removeOne } from './cartLines'
import type { CartLine } from './types'

type CartValue = {
  lines: CartLine[]
  add: (snack: Snack) => void
  removeOne: (snackId: string) => void
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

/*
  OEFENING 3: EFFECTS, HET MANDJE ONTHOUDEN (15 minuten)
  Vast? Kijk in SPIEKBRIEF.md onder "Effects".

  Probeer eerst: leg een paar snacks in je mandje en druk op F5. Alles weg.

  STAP 1  Bewaar het mandje in localStorage, onder de sleutel 'frietkot.mandje', telkens als het verandert.
          Kijk in DevTools (Application > Local Storage) of het er staat.
  STAP 2  Lees het bewaarde mandje terug als de app start. Niets bewaard of onleesbaar? Begin dan leeg.
          Hier heb je geen effect voor nodig.
  STAP 3  CartBadge.tsx: zet het aantal items in de titel van het tabblad, zoals "(3) Frietkot".
          Bij een leeg mandje is de titel gewoon "Frietkot".

  STAP 4  Als er tijd is: trek STAP 1 en 2 samen in een eigen hook useLocalStorage(key, initial),
          die werkt zoals useState maar de waarde bewaart.
*/

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
  }

  return <CartContext value={value}>{children}</CartContext>
}

/** Haalt het mandje op, in elk component binnen de CartProvider. */
export function useCart(): CartValue {
  const cart = use(CartContext)
  if (!cart) throw new Error('useCart werkt enkel binnen een CartProvider')
  return cart
}
