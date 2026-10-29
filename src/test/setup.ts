import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { mockApi, resetMockData } from '../mocks/handlers'
import { server } from '../mocks/server'

// Dezelfde MSW-handlers als in de browser: tests praten met dezelfde nep-API.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  mockApi.fail = false
  resetMockData()
})
afterAll(() => server.close())
