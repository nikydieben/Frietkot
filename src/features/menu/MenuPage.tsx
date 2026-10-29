import { useCart } from '../cart/CartContext'
import { SnackCard } from './SnackCard'
import { useSnacks } from './useSnacks'

export function MenuPage() {
  const { status, data: snacks, error } = useSnacks()
  const { add } = useCart()

  return (
    <section>
      <h1>Menu</h1>
      <p>Alles vers uit de frituur.</p>
      {/* STAP 6 (als er tijd is): filterknoppen per categorie, met de klassen chips en chip */}
      {status === 'pending' && <p className="state state--loading">Snacks laden…</p>}
      {status === 'error' && <p className="state state--error" role="alert">{error.message}</p>}
      {status === 'success' && (
        <ul className="snack-grid">
          {snacks.map(snack => (
            <SnackCard key={snack.id} snack={snack} onAdd={add} />
          ))}
        </ul>
      )}
    </section>
  )
}
