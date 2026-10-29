import type { Snack } from '../../shared/api/snacks'
import type { CartLine } from './types'

/** Geeft een nieuwe lijst terug: de snack erbij, of één stuk meer als hij er al in zit. */
export function addSnack(lines: CartLine[], snack: Snack): CartLine[] {
  const existing = lines.find(line => line.snack.id === snack.id)
  return existing
    ? lines.map(line => (line.snack.id === snack.id ? { ...line, quantity: line.quantity + 1 } : line))
    : [...lines, { snack, quantity: 1 }]
}

/** Geeft een nieuwe lijst terug met één stuk minder. Bij 0 verdwijnt de lijn. */
export function removeOne(lines: CartLine[], snackId: string): CartLine[] {
  return lines
    .map(line => (line.snack.id === snackId ? { ...line, quantity: line.quantity - 1 } : line))
    .filter(line => line.quantity > 0)
}
