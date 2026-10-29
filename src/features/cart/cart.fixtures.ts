import type { Snack, SnackCategory } from '../../shared/api/snacks'
import { addSnack } from './cart'
import type { CartLine } from './types'

const snack = (id: string, name: string, price: number, category: SnackCategory): Snack =>
  ({ id, name, price, category, vegetarian: true, emoji: '' })

export const groteFriet = snack('friet-groot', 'Grote friet', 4.1, 'frieten')
export const kleineFriet = snack('friet-klein', 'Kleine friet', 3.2, 'frieten')
export const mayo = snack('mayo', 'Mayonaise', 0.9, 'sauzen')
export const kaaskroket = snack('kaaskroket', 'Kaaskroket', 3.0, 'snacks')

/** Een mandje met deze snacks, in volgorde: cartWith(groteFriet, groteFriet, mayo) */
export function cartWith(...snacks: Snack[]): CartLine[] {
  return snacks.reduce<CartLine[]>((lines, s) => addSnack(lines, s), [])
}
