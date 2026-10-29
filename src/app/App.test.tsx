import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('toont de Frietkot-layout met het menu', () => {
  render(<App />)

  expect(screen.getByText('🍟 Frietkot')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument()
})
