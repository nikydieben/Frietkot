import type { Snack } from '../../shared/api/snacks'
import { formatPrice } from '../../shared/format'

type SnackCardProps = {
  snack: Snack
}

/** Toont één snack. Een "dumb" component: het krijgt alles via props. */
export function SnackCard({ snack }: SnackCardProps) {
  return (
    <li className="snack-card">
      <span className="snack-card__emoji" aria-hidden="true">{snack.emoji}</span>
      <h2 className="snack-card__name">{snack.name}</h2>
      <span className="snack-card__price">{formatPrice(snack.price)}</span>
      {snack.vegetarian && <span className="tag-veggie">vegetarisch</span>}
    </li>
  )
}
