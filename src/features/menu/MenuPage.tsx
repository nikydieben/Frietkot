import { useSearchParams } from 'react-router'
import type { SnackCategory } from '../../shared/api/snacks'
import { useCart } from '../cart/CartContext'
import { SnackCard } from './SnackCard'
import { useSnacks } from './useSnacks'

const filters: { category: SnackCategory | null; label: string }[] = [
  { category: null, label: 'Alles' },
  { category: 'frieten', label: 'Frieten' },
  { category: 'snacks', label: 'Snacks' },
  { category: 'sauzen', label: 'Sauzen' },
]

export function MenuPage() {
  const { status, data: snacks, error } = useSnacks()
  const { add } = useCart()

  // URL-state: het filter staat in ?categorie=, dus deelbaar en bestand tegen een refresh.
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('categorie')

  return (
    <section>
      <h1>Menu</h1>

      <div className="chips" role="group" aria-label="Filter op categorie">
        {filters.map(({ category, label }) => (
          <button
            key={label}
            type="button"
            className={category === activeCategory ? 'chip chip--active' : 'chip'}
            aria-pressed={category === activeCategory}
            onClick={() => setSearchParams(category ? { categorie: category } : {})}
          >
            {label}
          </button>
        ))}
      </div>

      {status === 'pending' && <p className="state state--loading">Snacks laden…</p>}
      {status === 'error' && <p className="state state--error" role="alert">{error.message}</p>}
      {status === 'success' && (
        <ul className="snack-grid">
          {snacks
            .filter(snack => !activeCategory || snack.category === activeCategory)
            .map(snack => (
              <SnackCard key={snack.id} snack={snack} onAdd={add} />
            ))}
        </ul>
      )}
    </section>
  )
}
