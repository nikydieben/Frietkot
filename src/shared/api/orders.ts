/** Een bestelling zoals de API ze verwacht (DTO). */
export type OrderRequestDto = {
  customer_name: string
  pickup_time: string
  delivery_address: string | null
  items: { snack_id: string; quantity: number }[]
}

/** Een bestelling zoals de API ze teruggeeft (DTO). */
export type OrderDto = {
  order_number: number
  customer_name: string
  pickup_time: string
  delivery_address: string | null
  item_count: number
}

/** Wat de UI doorgeeft. Een CartLine past hier gewoon in. Geen adres = afhalen. */
export type NewOrder = {
  name: string
  time: string
  address: string | null
  lines: { snack: { id: string }; quantity: number }[]
}

/** Een bestelling zoals de UI ze gebruikt. */
export type Order = { number: number; name: string; time: string; address: string | null; itemCount: number }

function toOrder(dto: OrderDto): Order {
  return {
    number: dto.order_number,
    name: dto.customer_name,
    time: dto.pickup_time,
    address: dto.delivery_address,
    itemCount: dto.item_count,
  }
}

export async function placeOrder(order: NewOrder): Promise<Order> {
  const body: OrderRequestDto = {
    customer_name: order.name,
    pickup_time: order.time,
    delivery_address: order.address ?? null,
    items: order.lines.map(line => ({ snack_id: line.snack.id, quantity: line.quantity })),
  }
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Bestellen mislukt (${response.status})`)
  return toOrder(await response.json())
}

export async function getOrder(number: number): Promise<Order> {
  const response = await fetch(`/api/orders/${number}`)
  if (response.status === 404) throw new Error('Bestelling niet gevonden')
  if (!response.ok) throw new Error(`Bestelling laden mislukt (${response.status})`)
  return toOrder(await response.json())
}
