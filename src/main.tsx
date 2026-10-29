import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import { routes } from './app/routes.tsx'

const queryClient = new QueryClient()
const router = createBrowserRouter(routes)

// De app heeft geen echte snack-API: MSW speelt die na, ook offline.
// Ook de assistent van de finale is nep. Requests die MSW niet kent (zoals de echte backend) gaan gewoon door.
async function startMockApi() {
  const { worker } = await import('./mocks/browser')
  const { mockApi } = await import('./mocks/handlers')
  mockApi.fail = new URLSearchParams(window.location.search).get('api') === 'fout'
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
}

startMockApi().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
})
