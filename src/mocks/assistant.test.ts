import { expect, test } from 'vitest'
import type { SnackDto } from '../shared/api/snacks'
import { fakeAssistant, type ChatMessage } from './assistant'
import snackData from './data/snacks.json'

const snacks = snackData as SnackDto[]

const ask = (text: string) => fakeAssistant([{ role: 'user', parts: [{ type: 'text', text }] }], snacks)
const tools = (steps: ReturnType<typeof ask>) => steps.flat().filter(event => 'tool' in event)

test('stelt een bestelling voor de groep samen, binnen het budget', () => {
  const [showSnacks, addToCart] = tools(ask('We zijn met 4, budget 30 euro, 1 vegetariër'))

  expect(showSnacks).toMatchObject({ tool: 'showSnacks', input: { vegetarian: true } })
  expect(addToCart).toMatchObject({ tool: 'addToCart' })
  const { items } = addToCart.input as { items: { id: string; quantity: number }[] }
  expect(items).toContainEqual({ id: 'kaaskroket', quantity: 1 })
  expect(items).toContainEqual({ id: 'frikandel', quantity: 3 })
  const total = items.reduce((sum, { id, quantity }) => sum + quantity * snacks.find(s => s.id === id)!.price_eur, 0)
  expect(total).toBeLessThanOrEqual(30)
})

test('toont enkel vegetarische snacks en stopt niets in het mandje', () => {
  const steps = ask('Wat is er vegetarisch?')

  const [showSnacks] = tools(steps)
  expect(tools(steps)).toHaveLength(1)
  expect(showSnacks.tool).toBe('showSnacks')
  const output = (showSnacks as { output: SnackDto[] }).output
  expect(output.length).toBeGreaterThan(0)
  expect(output.every(s => s.is_vegetarian)).toBe(true)
  // De laatste stap is tekst, anders stuurt useChat het gesprek meteen terug.
  expect(steps.at(-1)!.every(event => 'text' in event)).toBe(true)
})

test('herkent snacks met een aantal', () => {
  expect(tools(ask('Doe er 2 grote frieten en een frikandel bij'))).toEqual([
    { tool: 'addToCart', input: { items: [{ id: 'friet-groot', quantity: 2 }, { id: 'frikandel', quantity: 1 }] } },
  ])
})

test('navigeert naar het mandje', () => {
  expect(tools(ask('Toon mijn mandje'))).toEqual([{ tool: 'navigate', input: { path: '/mandje' } }])
})

test('weigert wat niet op het menu staat', () => {
  const steps = ask('Hebben jullie sushi?')
  expect(tools(steps)).toEqual([])
  expect(JSON.stringify(steps)).toContain('Sushi?')
})

test('zegt het als addToCart nog niets toevoegt', () => {
  const afterTool: ChatMessage[] = [
    { role: 'user', parts: [{ type: 'text', text: 'Doe er 2 grote frieten bij' }] },
    { role: 'assistant', parts: [{ type: 'tool-addToCart', input: {}, output: { added: [] } }] },
  ]
  expect(JSON.stringify(fakeAssistant(afterTool, snacks))).toContain('stap 3')
})
