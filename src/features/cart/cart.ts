import type { Snack } from '../../shared/api/snacks'
import type { CartLine } from './types'

const FRIES_DISCOUNT = 0.1
const FRIES_DISCOUNT_FROM = 3

// Rekenen in centen: 0.1 + 0.2 is in JavaScript (en in C# met double) niet exact 0.3.
const toCents = (euro: number) => Math.round(euro * 100)
const toEuro = (cents: number) => cents / 100

export function addSnack(lines: CartLine[], snack: Snack): CartLine[] {
  const existing = lines.find(line => line.snack.id === snack.id)
  return existing
    ? lines.map(line => (line.snack.id === snack.id ? { ...line, quantity: line.quantity + 1 } : line))
    : [...lines, { snack, quantity: 1 }]
}

export function removeOne(lines: CartLine[], snackId: string): CartLine[] {
  return lines
    .map(line => (line.snack.id === snackId ? { ...line, quantity: line.quantity - 1 } : line))
    .filter(line => line.quantity > 0)
}

export function itemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}

function friesLines(lines: CartLine[]): CartLine[] {
  return lines.filter(line => line.snack.category === 'frieten')
}

function subtotalCents(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + toCents(line.snack.price) * line.quantity, 0)
}

function friesDiscountCents(lines: CartLine[]): number {
  const fries = friesLines(lines)
  return itemCount(fries) >= FRIES_DISCOUNT_FROM ? Math.round(subtotalCents(fries) * FRIES_DISCOUNT) : 0
}

export function subtotal(lines: CartLine[]): number {
  return toEuro(subtotalCents(lines))
}

export function friesDiscount(lines: CartLine[]): number {
  return toEuro(friesDiscountCents(lines))
}

export function cartTotal(lines: CartLine[]): number {
  return toEuro(subtotalCents(lines) - friesDiscountCents(lines))
}
