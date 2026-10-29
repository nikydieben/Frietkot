import { CartBadge } from '../features/cart/CartBadge'
import { CartProvider } from '../features/cart/CartContext'
import { CartSummary } from '../features/cart/CartSummary'
import { MenuPage } from '../features/menu/MenuPage'
// STAP 2: haal de // weg op de volgende regel
// import { Outlet } from 'react-router'

/*
  OEFENING 4: ROUTING (20 minuten)
  Vast? Kijk in SPIEKBRIEF.md onder "Routing".

  STAP 1  main.tsx: maak een router met de routes uit routes.tsx en render die in plaats van <App />.
          De app werkt zoals voordien.
  STAP 2  Hieronder: laat <main> de pagina van de huidige route tonen, in plaats van
          het menu en het mandje. Op / is dat het menu.
  STAP 3  routes.tsx: voeg een route toe voor de detailpagina (/snack/:id) en voor het mandje (/mandje).
          Test door in de adresbalk /mandje en /snack/friet-groot te typen.
  STAP 4  SnackDetailPage.tsx: haal de id uit de URL, en toon
          "Snack niet gevonden" voor een onbekende snack (probeer /snack/sushi).
  STAP 5  Links: zet in de header een navigatie (klasse app-nav) met links naar het menu
          en het mandje. Maak van de naam op SnackCard een link naar de detailpagina.
  STAP 6  Als er tijd is: filterknoppen per categorie in MenuPage,
          met het filter in de URL (?categorie=frieten, zie useSearchParams).

  Vroeg klaar? Doe de bonusopdracht uit BONUS.md.
*/
export default function App() {
  return (
    <CartProvider>
      <div className="app">
        <header className="app-header">
          <span className="logo">🍟 Frietkot</span>
          {/* STAP 5: de navigatie */}
          <CartBadge />
        </header>

        <main className="app-main">
          {/* STAP 2: hier komt de pagina van de huidige route */}
          <MenuPage />
          <h2>Mandje</h2>
          <CartSummary />
        </main>

        <footer className="app-footer">Frietkot · React foundations voor .NET'ers</footer>
      </div>
    </CartProvider>
  )
}
