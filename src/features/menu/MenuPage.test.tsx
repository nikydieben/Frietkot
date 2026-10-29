import { screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { mockApi } from '../../mocks/handlers'
import { renderRoute } from '../../test/render'

test('toont een kaart per snack', async () => {
  renderRoute('/')

  expect(screen.getByText('Snacks laden…')).toBeInTheDocument()
  expect(await screen.findAllByRole('listitem')).toHaveLength(13)
  expect(screen.getByRole('heading', { name: 'Grote friet' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Grote friet toevoegen' })).toBeInTheDocument()
})

test('toont een foutmelding als de API faalt', async () => {
  mockApi.fail = true
  renderRoute('/')

  expect(await screen.findByRole('alert')).toHaveTextContent('Snacks laden mislukt (500)')
})
