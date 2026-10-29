import { screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { mockApi } from '../../mocks/handlers'
import { renderWithProviders } from '../../test/render'
import { CartProvider } from '../cart/CartContext'
import { MenuPage } from './MenuPage'

const renderMenu = () => renderWithProviders(<CartProvider><MenuPage /></CartProvider>)

test('toont een kaart per snack', async () => {
  renderMenu()

  expect(screen.getByText('Snacks laden…')).toBeInTheDocument()
  expect(await screen.findAllByRole('listitem')).toHaveLength(13)
  expect(screen.getByRole('button', { name: 'Grote friet toevoegen' })).toBeInTheDocument()
})

test('toont een foutmelding als de API faalt', async () => {
  mockApi.fail = true
  renderMenu()

  expect(await screen.findByRole('alert')).toHaveTextContent('Snacks laden mislukt (500)')
})
