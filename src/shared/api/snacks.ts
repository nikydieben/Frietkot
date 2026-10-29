export type SnackCategory = 'frieten' | 'snacks' | 'sauzen'

/** Een snack zoals de API hem teruggeeft (DTO). */
export type SnackDto = {
  id: string
  display_name: string
  price_eur: number
  category: SnackCategory
  is_vegetarian: boolean
  emoji: string
}

/** Een snack zoals de UI hem gebruikt. Components kennen enkel dit type. */
export type Snack = {
  id: string
  name: string
  price: number
  category: SnackCategory
  vegetarian: boolean
  emoji: string
}

export function toSnack(dto: SnackDto): Snack {
  return {
    id: dto.id,
    name: dto.display_name,
    price: dto.price_eur,
    category: dto.category,
    vegetarian: dto.is_vegetarian,
    emoji: dto.emoji,
  }
}

/** Components roepen nooit zelf fetch aan, enkel functies uit de API-laag. */
export async function getSnacks(): Promise<Snack[]> {
  const response = await fetch('/api/snacks')
  if (!response.ok) throw new Error(`Snacks laden mislukt (${response.status})`)
  const dtos: SnackDto[] = await response.json()
  return dtos.map(toSnack)
}

export async function updateSnackPrice(id: string, price: number): Promise<Snack> {
  const response = await fetch(`/api/snacks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price_eur: price }),
  })
  if (!response.ok) throw new Error(`Prijs opslaan mislukt (${response.status})`)
  return toSnack(await response.json())
}
