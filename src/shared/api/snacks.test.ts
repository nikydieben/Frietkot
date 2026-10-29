import { expect, test } from 'vitest'
import { mockApi } from '../../mocks/handlers'
import { getSnacks } from './snacks'

test('zet de API-DTO om naar het UI-model', async () => {
  const snacks = await getSnacks()

  expect(snacks[0]).toEqual({
    id: 'friet-klein',
    name: 'Kleine friet',
    price: 3.2,
    category: 'frieten',
    vegetarian: true,
    emoji: '🍟',
  })
})

test('geeft een duidelijke fout als de API faalt', async () => {
  mockApi.fail = true

  await expect(getSnacks()).rejects.toThrow('Snacks laden mislukt (500)')
})
