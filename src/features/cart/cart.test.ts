import { describe, expect, test } from 'vitest'
import { cartTotal, friesDiscount, itemCount, removeOne } from './cart'
import { cartWith, groteFriet, kaaskroket, kleineFriet, mayo } from './cart.fixtures'

// Eén describe per regel van SPECIFICATIEKAART.md
describe('1. toevoegen', () => {
  test('een snack die al in het mandje zit, verhoogt het aantal', () => {
    expect(cartWith(groteFriet, groteFriet)).toEqual([{ snack: groteFriet, quantity: 2 }])
  })
})

describe('2. eén minder', () => {
  test('haalt precies één stuk weg', () => {
    expect(removeOne(cartWith(groteFriet, groteFriet, groteFriet), 'friet-groot')).toEqual([{ snack: groteFriet, quantity: 2 }])
  })
  test('bij aantal 1 verdwijnt de lijn', () => {
    expect(removeOne(cartWith(groteFriet), 'friet-groot')).toEqual([])
  })
})

describe('3. aantal items', () => {
  test('is de som van alle aantallen', () => {
    expect(itemCount(cartWith(groteFriet, groteFriet, mayo))).toBe(3)
  })
})

describe('4. frietkorting', () => {
  test('vanaf 3 frieten 10% korting op de frieten', () => {
    expect(friesDiscount(cartWith(kleineFriet, groteFriet, groteFriet))).toBeCloseTo(1.14, 2)
  })
  test('bij 2 frieten geen korting', () => {
    expect(friesDiscount(cartWith(groteFriet, groteFriet))).toBe(0)
  })
})

describe('5. sauzen en snacks', () => {
  test('tellen niet mee voor de korting en krijgen er geen', () => {
    const lines = cartWith(kleineFriet, kleineFriet, kleineFriet, kleineFriet, mayo, kaaskroket)
    expect(friesDiscount(lines)).toBeCloseTo(1.28, 2)
    expect(cartTotal(lines)).toBeCloseTo(15.42, 2)
  })
  test('2 frieten met saus en snack geven geen korting', () => {
    expect(friesDiscount(cartWith(groteFriet, groteFriet, mayo, kaaskroket))).toBe(0)
  })
})

describe('6. tot op de cent', () => {
  test('1 kleine friet + 1 mayonaise kost precies € 4,10', () => {
    expect(cartTotal(cartWith(kleineFriet, mayo))).toBe(4.1)
  })
})

describe('7. leeg mandje', () => {
  test('kost € 0,00', () => {
    expect(cartTotal([])).toBe(0)
  })
})
