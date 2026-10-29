import { Link, NavLink, Outlet, useNavigation } from 'react-router'
import { AssistantPanel } from '../features/assistant/AssistantPanel'
import { CartBadge } from '../features/cart/CartBadge'
import { CartProvider } from '../features/cart/CartContext'

/** Layout-route: de header en het mandje blijven, de pagina komt in de Outlet. */
export default function App() {
  const navigation = useNavigation()

  return (
    <CartProvider>
      <div className="app">
        <header className="app-header">
          <Link className="logo" to="/">🍟 Frietkot</Link>
          <nav className="app-nav" aria-label="Hoofdnavigatie">
            <NavLink to="/" end>Menu</NavLink>
            <NavLink to="/mandje">Mandje</NavLink>
            <NavLink to="/admin">Beheer</NavLink>
          </nav>
          <CartBadge />
        </header>

        <main className="app-main">
          {navigation.state === 'loading' && <p className="state state--loading" role="status">Pagina laden…</p>}
          <Outlet />
        </main>

        <AssistantPanel />

        <footer className="app-footer">Frietkot · React foundations voor .NET'ers</footer>
      </div>
    </CartProvider>
  )
}
