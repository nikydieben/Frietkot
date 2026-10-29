import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { renderRoute } from '../../test/render'

test('een prijs aanpassen werkt het menu bij', async () => {
  const user = userEvent.setup()
  renderRoute('/admin')

  const price = await screen.findByRole('spinbutton', { name: 'Prijs van Grote friet' })
  await user.clear(price)
  await user.type(price, '4.5')
  await user.click(screen.getByRole('button', { name: 'Prijs van Grote friet opslaan' }))
  await screen.findByRole('button', { name: 'Prijs van Grote friet opslaan' })

  await user.click(screen.getByRole('link', { name: 'Menu' }))
  expect(await screen.findByText(/4,50 · frieten/)).toBeInTheDocument()
})
