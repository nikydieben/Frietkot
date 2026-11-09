import { MenuPage } from '../features/menu/MenuPage'
import { CartBadge } from '../features/cart/CartBadge'
import { CartProvider } from '../features/cart/CartContext'
import { CartSummary } from '../features/cart/CartSummary'

/** De app: header met de badge, het menu en het mandje. */
export default function App() {
  return (
    <CartProvider>
      <div className="app">
        <header className="app-header">
          <span className="logo">🍟 Frietkot</span>
          <CartBadge />
        </header>

        <main className="app-main">
          <MenuPage />
          <CartSummary />
        </main>

        <footer className="app-footer">Frietkot · React foundations voor .NET'ers</footer>
      </div>
    </CartProvider>
  )
}
