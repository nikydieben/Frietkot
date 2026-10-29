import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { renderRoute } from '../test/render'

test('een snackkaart linkt naar de detailpagina', async () => {
  const user = userEvent.setup()
  const { router } = renderRoute('/')

  await user.click(await screen.findByRole('link', { name: 'Grote friet' }))

  expect(router.state.location.pathname).toBe('/snack/friet-groot')
  expect(screen.getByRole('heading', { level: 1, name: 'Grote friet' })).toBeInTheDocument()
})

test('een onbekende snack toont "niet gevonden" met een link naar het menu', async () => {
  renderRoute('/snack/bestaat-niet')

  expect(await screen.findByRole('heading', { name: 'Snack niet gevonden' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Terug naar het menu' })).toHaveAttribute('href', '/')
})

test('het filter staat in de URL', async () => {
  const user = userEvent.setup()
  const { router } = renderRoute('/')

  await user.click(await screen.findByRole('button', { name: 'Sauzen' }))

  expect(router.state.location.search).toBe('?categorie=sauzen')
  expect(screen.getAllByRole('listitem')).toHaveLength(4)
})

test('een gedeelde link opent met het filter actief', async () => {
  renderRoute('/?categorie=frieten')

  expect(await screen.findAllByRole('listitem')).toHaveLength(3)
  expect(screen.getByRole('button', { name: 'Frieten' })).toHaveAttribute('aria-pressed', 'true')
})
