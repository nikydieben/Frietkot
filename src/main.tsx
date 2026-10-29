import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'

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
      <App />
    </StrictMode>,
  )
})
