import { SnackCard } from './SnackCard'
import { useSnacks } from './useSnacks'

/*
  OEFENING 1: FOUNDATIONS (25 minuten)
  Vast? Kijk in SPIEKBRIEF.md onder "Foundations".

  Start de app met npm run dev en open http://localhost:5173.
  Na elke stap zie je het resultaat meteen in de browser.

  STAP 1  Zet onder de titel <h1>Menu</h1> een zin, bv. <p>Alles vers uit de frituur.</p>, en sla op.
  STAP 2  Open SnackCard.tsx en toon de naam en de prijs van de snack.
  STAP 3  Toon in SnackCard het label "vegetarisch", maar enkel voor vegetarische snacks.
  STAP 4  Nu staat er één kaart op het menu. Toon er één per snack, elk met een unieke key.

  Bonus (al frontend gedaan?): een knop "Toevoegen" met een onAdd-prop, of BONUS.md.
*/
export function MenuPage() {
  const result = useSnacks()

  return (
    <section>
      <h1>Menu</h1>
      {result.status === 'pending' && <p className="state state--loading">Snacks laden…</p>}
      {result.status === 'error' && <p className="state state--error" role="alert">{result.error.message}</p>}
      {result.status === 'success' && (
        <ul className="snack-grid">
          {/* STAP 4: vervang deze ene kaart door een kaart per snack in result.snacks */}
          <SnackCard snack={result.snacks[0]} />
        </ul>
      )}
    </section>
  )
}
