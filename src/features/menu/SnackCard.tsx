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

      {/* STAP 2: toon de naam, met className="snack-card__name" */}

      {/* STAP 2: toon de prijs, met className="snack-card__price" */}

      {/* STAP 3: toon het label "vegetarisch", met className="tag-veggie", maar enkel voor vegetarische snacks */}
    </li>
  )
}
