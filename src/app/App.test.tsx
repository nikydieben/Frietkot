import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { renderRoute } from '../test/render'

test('toont de Frietkot-layout met het menu', async () => {
  renderRoute('/')

  expect(screen.getByRole('link', { name: '🍟 Frietkot' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument()
  expect(await screen.findAllByRole('listitem')).toHaveLength(13)
})

test('snacks toevoegen werkt de badge en het mandje bij', async () => {
  const user = userEvent.setup()
  renderRoute('/')

  await user.click(await screen.findByRole('button', { name: 'Grote friet toevoegen' }))
  await user.click(screen.getByRole('button', { name: 'Grote friet toevoegen' }))
  await user.click(screen.getByRole('button', { name: 'Mayonaise toevoegen' }))
  expect(screen.getByRole('link', { name: '3 items in je mandje' })).toBeInTheDocument()

  await user.click(screen.getByRole('link', { name: '3 items in je mandje' }))
  expect(screen.getByRole('heading', { name: 'Mandje' })).toBeInTheDocument()
  expect(screen.getByRole('status', { name: 'Totaal' })).toHaveTextContent('9,10')

  await user.click(screen.getByRole('button', { name: 'Eén Mayonaise minder' }))
  expect(screen.getByRole('link', { name: '2 items in je mandje' })).toBeInTheDocument()
})
