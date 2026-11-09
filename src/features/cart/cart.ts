import type { Snack } from '../../shared/api/snacks'
import type { CartLine } from './types'

const FRIES_DISCOUNT = 0.1
const FRIES_DISCOUNT_FROM = 3

export function addSnack(lines: CartLine[], snack: Snack): CartLine[] {
  const existing = lines.find(line => line.snack.id === snack.id)
  return existing
    ? lines.map(line => (line.snack.id === snack.id ? { ...line, quantity: line.quantity + 1 } : line))
    : [...lines, { snack, quantity: 1 }]
}

export function removeOne(lines: CartLine[], snackId: string): CartLine[] {
  return lines.filter(line => line.snack.id !== snackId)
}

export function itemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}

function friesLines(lines: CartLine[]): CartLine[] {
  return lines.filter(line => line.snack.category === 'frieten')
}

export function subtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.snack.price * line.quantity, 0)
}

export function friesDiscount(lines: CartLine[]): number {
  const fries = friesLines(lines)
  if (itemCount(fries) > FRIES_DISCOUNT_FROM) {
    return subtotal(fries) * FRIES_DISCOUNT
  }
  return 0
}

export function cartTotal(lines: CartLine[]): number {
  return subtotal(lines) - friesDiscount(lines)
}
