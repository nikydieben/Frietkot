import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { mockApi } from '../../mocks/handlers'
import { renderRoute } from '../../test/render'
import { cartWith, groteFriet, mayo } from './cart.fixtures'

function withSavedCart() {
  localStorage.setItem('frietkot.mandje', JSON.stringify(cartWith(groteFriet, groteFriet, mayo)))
}

test('zonder naam en tijdstip toont het formulier fouten en verstuurt het niets', async () => {
  const user = userEvent.setup()
  withSavedCart()
  renderRoute('/mandje')

  await user.click(screen.getByRole('button', { name: 'Bestellen' }))

  expect(screen.getByLabelText('Naam')).toHaveAccessibleDescription('Vul je naam in')
  expect(screen.getByLabelText('Tijdstip')).toHaveAccessibleDescription('Kies een tijdstip tussen 17:00 en 21:00')
  expect(screen.getByRole('link', { name: '3 items in je mandje' })).toBeInTheDocument()
})

test('een tijdstip buiten de openingsuren mag niet', async () => {
  const user = userEvent.setup()
  withSavedCart()
  renderRoute('/mandje')

  await user.type(screen.getByLabelText('Naam'), 'Niky')
  await user.type(screen.getByLabelText('Tijdstip'), '15:00')
  await user.click(screen.getByRole('button', { name: 'Bestellen' }))

  expect(screen.getByLabelText('Tijdstip')).toHaveAccessibleDescription('Kies een tijdstip tussen 17:00 en 21:00')
})

test('bestellen maakt het mandje leeg en toont de bevestiging op /bestelling/1', async () => {
  const user = userEvent.setup()
  withSavedCart()
  const { router } = renderRoute('/mandje')

  await user.type(screen.getByLabelText('Naam'), 'Niky')
  await user.type(screen.getByLabelText('Tijdstip'), '18:30')
  await user.click(screen.getByRole('button', { name: 'Bestellen' }))

  expect(await screen.findByText('Bestelling 1 staat klaar om 18:30')).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/bestelling/1')
  expect(screen.getByRole('heading', { name: 'Bedankt, Niky!' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: '0 items in je mandje' })).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem('frietkot.mandje') ?? 'null')).toEqual([])
})

test('bij levering verschijnt een adresveld, en dan is een adres verplicht', async () => {
  const user = userEvent.setup()
  withSavedCart()
  renderRoute('/mandje')

  expect(screen.queryByLabelText('Adres')).not.toBeInTheDocument()
  await user.click(screen.getByRole('radio', { name: 'Levering' }))
  await user.type(screen.getByLabelText('Naam'), 'Niky')
  await user.type(screen.getByLabelText('Tijdstip'), '19:00')
  await user.click(screen.getByRole('button', { name: 'Bestellen' }))
  expect(screen.getByLabelText('Adres')).toHaveAccessibleDescription('Vul je adres in')

  await user.type(screen.getByLabelText('Adres'), 'Kerkstraat 1, Antwerpen')
  await user.click(screen.getByRole('button', { name: 'Bestellen' }))
  expect(await screen.findByText('Bestelling 1 wordt om 19:00 geleverd op Kerkstraat 1, Antwerpen')).toBeInTheDocument()
})

test('mislukt de API, dan blijft het mandje en zie je de fout', async () => {
  const user = userEvent.setup()
  mockApi.fail = true
  withSavedCart()
  renderRoute('/mandje')

  await user.type(screen.getByLabelText('Naam'), 'Niky')
  await user.type(screen.getByLabelText('Tijdstip'), '18:30')
  await user.click(screen.getByRole('button', { name: 'Bestellen' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('Bestellen mislukt (500)')
  expect(screen.getByRole('link', { name: '3 items in je mandje' })).toBeInTheDocument()
})

test('met een leeg mandje is er geen formulier', () => {
  renderRoute('/mandje')

  expect(screen.queryByRole('form', { name: 'Bestellen' })).not.toBeInTheDocument()
})

test('een onbekende bestelling toont "niet gevonden"', async () => {
  renderRoute('/bestelling/99')

  expect(await screen.findByRole('heading', { name: 'Bestelling niet gevonden' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Terug naar het menu' })).toHaveAttribute('href', '/')
})
