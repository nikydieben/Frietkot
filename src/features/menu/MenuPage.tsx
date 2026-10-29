import type { Snack } from '../../shared/api/snacks'
import { SnackCard } from './SnackCard'
import { useSnacks } from './useSnacks'

type MenuPageProps = {
  onAdd: (snack: Snack) => void
}

export function MenuPage({ onAdd }: MenuPageProps) {
  const result = useSnacks()

  return (
    <section>
      <h1>Menu</h1>
      <p>Alles vers uit de frituur.</p>
      {result.status === 'pending' && <p className="state state--loading">Snacks laden…</p>}
      {result.status === 'error' && <p className="state state--error" role="alert">{result.error.message}</p>}
      {result.status === 'success' && (
        <ul className="snack-grid">
          {result.snacks.map(snack => (
            <SnackCard key={snack.id} snack={snack} onAdd={onAdd} />
          ))}
        </ul>
      )}
    </section>
  )
}
