import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { renderWithProviders } from '../test/render'
import App from './App'

test('toont de Frietkot-layout met het menu', async () => {
  renderWithProviders(<App />)

  expect(screen.getByText('🍟 Frietkot')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument()
  expect(await screen.findAllByRole('listitem')).toHaveLength(13)
})

test('snacks toevoegen werkt de badge en het mandje bij', async () => {
  const user = userEvent.setup()
  renderWithProviders(<App />)

  await user.click(await screen.findByRole('button', { name: 'Grote friet toevoegen' }))
  await user.click(screen.getByRole('button', { name: 'Grote friet toevoegen' }))
  await user.click(screen.getByRole('button', { name: 'Mayonaise toevoegen' }))

  expect(screen.getByLabelText('3 items in je mandje')).toBeInTheDocument()
  expect(screen.getByRole('status', { name: 'Totaal' })).toHaveTextContent('9,10')

  await user.click(screen.getByRole('button', { name: 'Eén Grote friet minder' }))
  expect(screen.getByLabelText('2 items in je mandje')).toBeInTheDocument()
})
