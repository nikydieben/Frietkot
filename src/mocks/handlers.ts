import { delay, http, HttpResponse } from 'msw'
import type { SnackDto } from '../shared/api/snacks'
import snacks from './data/snacks.json'
import { fakeAssistant, streamSteps, type ChatMessage } from './assistant'

/** Zet `fail` op true om de foutstatus van de app te zien. In de browser: `?api=fout`. */
export const mockApi = { fail: false }

// In-memory "database", zodat prijswijzigingen in de admin blijven tot een refresh.
let snackData: SnackDto[] = structuredClone(snacks as SnackDto[])

export function resetMockData() {
  snackData = structuredClone(snacks as SnackDto[])
}

export const handlers = [
  http.get('/api/snacks', async () => {
    await delay()
    if (mockApi.fail) return HttpResponse.json({ message: 'De frituurpan is stuk' }, { status: 500 })
    return HttpResponse.json(snackData)
  }),

  http.patch<{ id: string }, { price_eur: number }>('/api/snacks/:id', async ({ params, request }) => {
    await delay()
    const snack = snackData.find(s => s.id === params.id)
    if (!snack) return HttpResponse.json({ message: 'Onbekende snack' }, { status: 404 })
    snack.price_eur = (await request.json()).price_eur
    return HttpResponse.json(snack)
  }),

  // Nep-assistent voor de finale. Een vaste URL, zodat de echte backend (frietkot-api) gewoon doorgaat.
  http.post<never, { messages: ChatMessage[] }>('/api/chat', async ({ request }) => {
    await delay()
    const { messages } = await request.json()
    return streamSteps(fakeAssistant(messages, snackData))
  }),
]
