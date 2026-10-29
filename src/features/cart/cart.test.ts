import { expect, test } from 'vitest'
import { addSnack } from './cart'
import { groteFriet } from './cart.fixtures'

/*
  OEFENING 4: TESTING (25 minuten, pair vs pair)
  Vast? Kijk in SPIEKBRIEF.md onder "Testing".

  Schrijf tests voor de functies in cart.ts: addSnack, removeOne, itemCount, friesDiscount en cartTotal.
  Vertrek van de regels op de specificatiekaart (op papier), niet van de code.
  Eén regel van de kaart is één test.

  Draai de tests met: npm run test:watch
  Tip: cart.fixtures.ts heeft snacks en cartWith(...) om snel een mandje te maken.
*/

test('een snack toevoegen aan een leeg mandje geeft één lijn met aantal 1', () => {
  const lines = addSnack([], groteFriet)

  expect(lines).toEqual([{ snack: groteFriet, quantity: 1 }])
})
