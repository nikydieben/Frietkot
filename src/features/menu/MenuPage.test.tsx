import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { mockApi } from '../../mocks/handlers'
import { MenuPage } from './MenuPage'

test('toont een kaart per snack', async () => {
  render(<MenuPage onAdd={() => {}} />)

  expect(screen.getByText('Snacks laden…')).toBeInTheDocument()
  expect(await screen.findAllByRole('listitem')).toHaveLength(13)
  expect(screen.getByRole('heading', { name: 'Grote friet' })).toBeInTheDocument()
})

test('toont een foutmelding als de API faalt', async () => {
  mockApi.fail = true
  render(<MenuPage onAdd={() => {}} />)

  expect(await screen.findByRole('alert')).toHaveTextContent('Snacks laden mislukt (500)')
})
