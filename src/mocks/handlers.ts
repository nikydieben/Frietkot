import { delay, http, HttpResponse } from 'msw'
import type { OrderDto, OrderRequestDto } from '../shared/api/orders'
import type { SnackDto } from '../shared/api/snacks'
import snacks from './data/snacks.json'

/** Zet `fail` op true om de foutstatus van de app te zien. In de browser: `?api=fout`. */
export const mockApi = { fail: false }

// In-memory "database", zodat prijswijzigingen in de admin blijven tot een refresh.
let snackData: SnackDto[] = structuredClone(snacks as SnackDto[])

// Bestellingen, ook in het geheugen.
let orders: OrderDto[] = []

export function resetMockData() {
  snackData = structuredClone(snacks as SnackDto[])
  orders = []
}

/** De server valideert zelf ook: de browser is niet te vertrouwen. */
function orderError(order: OrderRequestDto): string | null {
  if (!order.customer_name.trim()) return 'Een naam is verplicht'
  if (order.items.length === 0) return 'Het mandje is leeg'
  if (!order.pickup_time || order.pickup_time < '17:00' || order.pickup_time > '21:00') return 'Kies een tijdstip tussen 17:00 en 21:00'
  if (order.delivery_address != null && !order.delivery_address.trim()) return 'Een adres is verplicht bij levering'
  return null
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

  http.post<never, OrderRequestDto>('/api/orders', async ({ request }) => {
    await delay()
    if (mockApi.fail) return HttpResponse.json({ message: 'De frituurpan is stuk' }, { status: 500 })
    const order = await request.json()
    const error = orderError(order)
    if (error) return HttpResponse.json({ message: error }, { status: 400 })
    const placed: OrderDto = {
      order_number: orders.length + 1,
      customer_name: order.customer_name.trim(),
      pickup_time: order.pickup_time,
      delivery_address: order.delivery_address?.trim() ?? null,
      item_count: order.items.reduce((sum, item) => sum + item.quantity, 0),
    }
    orders.push(placed)
    return HttpResponse.json(placed, { status: 201 })
  }),

  http.get<{ number: string }>('/api/orders/:number', async ({ params }) => {
    await delay()
    const order = orders.find(o => o.order_number === Number(params.number))
    if (!order) return HttpResponse.json({ message: 'Onbekende bestelling' }, { status: 404 })
    return HttpResponse.json(order)
  }),
]
