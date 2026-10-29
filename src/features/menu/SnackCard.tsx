import { Link } from 'react-router'
import type { Snack } from '../../shared/api/snacks'
import { formatPrice } from '../../shared/format'

type SnackCardProps = {
  snack: Snack
  onAdd: (snack: Snack) => void
}

/** Dumb component: toont een snack en meldt een klik via onAdd. */
export function SnackCard({ snack, onAdd }: SnackCardProps) {
  return (
    <li className="snack-card">
      <span className="snack-card__emoji" aria-hidden="true">{snack.emoji}</span>
      <h2 className="snack-card__name">
        <Link to={`/snack/${snack.id}`}>{snack.name}</Link>
      </h2>
      <span className="snack-card__price">{formatPrice(snack.price)} · {snack.category}</span>
      {snack.vegetarian && <span className="tag-veggie">vegetarisch</span>}
      <button
        type="button"
        className="button button--primary"
        aria-label={`${snack.name} toevoegen`}
        onClick={() => onAdd(snack)}
      >
        Toevoegen
      </button>
    </li>
  )
}
