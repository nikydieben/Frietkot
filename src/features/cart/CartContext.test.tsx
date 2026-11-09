import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { renderRoute } from '../../test/render'

test('bewaart het mandje in localStorage', async () => {
  const user = userEvent.setup()
  renderRoute('/')

  await user.click(await screen.findByRole('button', { name: 'Grote friet toevoegen' }))
  await user.click(screen.getByRole('button', { name: 'Grote friet toevoegen' }))

  const saved = JSON.parse(localStorage.getItem('frietkot.mandje') ?? '[]')
  expect(saved).toEqual([expect.objectContaining({ quantity: 2, snack: expect.objectContaining({ id: 'friet-groot' }) })])
})

test('start met het bewaarde mandje, ook na een refresh', async () => {
  const user = userEvent.setup()
  const first = renderRoute('/')
  await user.click(await screen.findByRole('button', { name: 'Mayonaise toevoegen' }))
  first.unmount()

  renderRoute('/mandje')
  expect(screen.getByRole('link', { name: '1 items in je mandje' })).toBeInTheDocument()
  expect(screen.getByText(/Mayonaise/)).toBeInTheDocument()
})

test('een onleesbaar mandje geeft een leeg mandje', () => {
  localStorage.setItem('frietkot.mandje', '{kapot')
  renderRoute('/mandje')

  expect(screen.getByRole('link', { name: '0 items in je mandje' })).toBeInTheDocument()
})

test('toont het aantal items in de titel van het tabblad', async () => {
  const user = userEvent.setup()
  renderRoute('/')
  expect(document.title).toBe('Frietkot')

  await user.click(await screen.findByRole('button', { name: 'Grote friet toevoegen' }))
  await user.click(screen.getByRole('button', { name: 'Mayonaise toevoegen' }))
  expect(document.title).toBe('(2) Frietkot')
})
