import { Link, NavLink, Outlet } from 'react-router'
import { CartBadge } from '../features/cart/CartBadge'
import { CartProvider } from '../features/cart/CartContext'

/** Layout-route: de header en het mandje blijven, de pagina komt in de Outlet. */
export default function App() {
  return (
    <CartProvider>
      <div className="app">
        <header className="app-header">
          <Link className="logo" to="/">🍟 Frietkot</Link>
          <nav className="app-nav" aria-label="Hoofdnavigatie">
            <NavLink to="/" end>Menu</NavLink>
            <NavLink to="/mandje">Mandje</NavLink>
          </nav>
          <CartBadge />
        </header>

        <main className="app-main">
          <Outlet />
        </main>

        <footer className="app-footer">Frietkot · React foundations voor .NET'ers</footer>
      </div>
    </CartProvider>
  )
}
