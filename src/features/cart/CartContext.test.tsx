import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import type { Snack } from '../../shared/api/snacks'
import { CartBadge } from './CartBadge'
import { CartProvider, useCart } from './CartContext'

const groteFriet: Snack = { id: 'friet-groot', name: 'Grote friet', price: 4.1, category: 'frieten', vegetarian: true, emoji: '🍟' }

function AddButton() {
  const { add } = useCart()
  return <button type="button" onClick={() => add(groteFriet)}>Grote friet toevoegen</button>
}

function renderCart() {
  return render(
    <CartProvider>
      <CartBadge />
      <AddButton />
    </CartProvider>,
  )
}

test('bewaart het mandje in localStorage', async () => {
  const user = userEvent.setup()
  renderCart()

  await user.click(screen.getByRole('button', { name: 'Grote friet toevoegen' }))
  await user.click(screen.getByRole('button', { name: 'Grote friet toevoegen' }))

  const saved = JSON.parse(localStorage.getItem('frietkot.mandje') ?? '[]')
  expect(saved).toEqual([{ snack: groteFriet, quantity: 2 }])
})

test('start met het bewaarde mandje, ook na een refresh', async () => {
  const user = userEvent.setup()
  const first = renderCart()
  await user.click(screen.getByRole('button', { name: 'Grote friet toevoegen' }))
  first.unmount()

  renderCart()
  expect(screen.getByLabelText('1 items in je mandje')).toBeInTheDocument()
})

test('een onleesbaar mandje geeft een leeg mandje', () => {
  localStorage.setItem('frietkot.mandje', '{kapot')
  renderCart()

  expect(screen.getByLabelText('0 items in je mandje')).toBeInTheDocument()
})

test('toont het aantal items in de titel van het tabblad', async () => {
  const user = userEvent.setup()
  renderCart()
  expect(document.title).toBe('Frietkot')

  await user.click(screen.getByRole('button', { name: 'Grote friet toevoegen' }))
  await user.click(screen.getByRole('button', { name: 'Grote friet toevoegen' }))
  expect(document.title).toBe('(2) Frietkot')
})
