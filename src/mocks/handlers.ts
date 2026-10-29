import { delay, http, HttpResponse } from 'msw'
import type { SnackDto } from '../shared/api/snacks'
import snacks from './data/snacks.json'

/** Zet `fail` op true om de foutstatus van de app te zien. In de browser: `?api=fout`. */
export const mockApi = { fail: false }

export const handlers = [
  http.get('/api/snacks', async () => {
    await delay()
    if (mockApi.fail) return HttpResponse.json({ message: 'De frituurpan is stuk' }, { status: 500 })
    return HttpResponse.json(snacks as SnackDto[])
  }),
]
