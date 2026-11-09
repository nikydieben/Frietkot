import { expect, test } from 'vitest'
import { groteFriet, mayo } from '../../features/cart/cart.fixtures'
import { getOrder, placeOrder } from './orders'

const lines = [{ snack: groteFriet, quantity: 2 }, { snack: mayo, quantity: 1 }]

test('plaatst een bestelling en haalt ze terug op', async () => {
  const placed = await placeOrder({ name: 'Niky', time: '18:30', address: null, lines })

  expect(placed).toEqual({ number: 1, name: 'Niky', time: '18:30', address: null, itemCount: 3 })
  expect(await getOrder(1)).toEqual(placed)
})

test('de server valideert ook: zonder naam geen bestelling', async () => {
  await expect(placeOrder({ name: ' ', time: '18:30', address: null, lines })).rejects.toThrow('Bestellen mislukt (400)')
})

test('de server valideert ook: buiten de openingsuren geen bestelling', async () => {
  await expect(placeOrder({ name: 'Niky', time: '15:00', address: null, lines })).rejects.toThrow('Bestellen mislukt (400)')
})

test('een onbekende bestelling geeft een duidelijke fout', async () => {
  await expect(getOrder(99)).rejects.toThrow('Bestelling niet gevonden')
})
