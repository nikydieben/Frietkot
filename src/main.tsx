import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// STAP 1: haal de // weg op de volgende 2 regels
// import { createBrowserRouter, RouterProvider } from 'react-router'
// import { routes } from './app/routes.tsx'
import './index.css'
import App from './app/App.tsx'

const queryClient = new QueryClient()
// STAP 1: maak hier de router

// De app heeft geen echte snack-API: MSW speelt die na, ook offline.
// Requests die MSW niet kent, gaan gewoon door.
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
        {/* STAP 1: render hier de router in plaats van <App /> */}
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
})
