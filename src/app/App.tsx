import { CartBadge } from '../features/cart/CartBadge'
import { CartProvider } from '../features/cart/CartContext'
import { CartSummary } from '../features/cart/CartSummary'
import { MenuPage } from '../features/menu/MenuPage'
// STAP 2: haal de // weg op de volgende regel
// import { Outlet } from 'react-router'

/*
  OEFENING 3: ROUTING (20 minuten, per 2)
  Vast? Kijk in SPIEKBRIEF.md onder "Routing".

  STAP 1  main.tsx: zet de router aan (haal de // weg) en vervang <App /> door
          <RouterProvider router={router} />. De import van App mag dan weg.
          De app werkt zoals voordien.
  STAP 2  Hieronder: vervang alles in <main> door <Outlet />.
          Daar komt de pagina van de huidige route: op / is dat het menu.
  STAP 3  routes.tsx: zet de routes voor de detailpagina en het mandje aan.
          Test door in de adresbalk /mandje en /snack/friet-groot te typen.
  STAP 4  SnackDetailPage.tsx: haal de id uit de URL met useParams(), en toon
          "Snack niet gevonden" voor een onbekende snack (probeer /snack/sushi).
  STAP 5  Links: zet in de header <NavLink to="/">Menu</NavLink> en
          <NavLink to="/mandje">Mandje</NavLink> in een <nav className="app-nav">.
          Maak van de naam op SnackCard een <Link> naar /snack/ + de id.
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
          {/* STAP 2: vervang alles in <main> door <Outlet /> */}
          <MenuPage />
          <h2>Mandje</h2>
          <CartSummary />
        </main>

        <footer className="app-footer">Frietkot · React foundations voor .NET'ers</footer>
      </div>
    </CartProvider>
  )
}
