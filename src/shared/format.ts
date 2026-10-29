const euro = new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' })

/** 4.1 -> "€ 4,10" */
export function formatPrice(price: number): string {
  return euro.format(price)
}
