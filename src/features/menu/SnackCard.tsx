import type { Snack } from '../../shared/api/snacks'
// STAP 2: haal de // weg op de volgende regel, dan kan je formatPrice gebruiken
// import { formatPrice } from '../../shared/format'

type SnackCardProps = {
  snack: Snack
}

/** Toont één snack. Een "dumb" component: het krijgt alles via props. */
export function SnackCard({ snack }: SnackCardProps) {
  return (
    <li className="snack-card">
      <span className="snack-card__emoji" aria-hidden="true">{snack.emoji}</span>

      {/* STAP 2: toon de naam: <h2 className="snack-card__name">{snack.name}</h2> */}

      {/* STAP 2: toon de prijs: <span className="snack-card__price">{formatPrice(snack.price)}</span> */}

      {/* STAP 3: toon <span className="tag-veggie">vegetarisch</span>, maar enkel als snack.vegetarian true is */}
    </li>
  )
}
