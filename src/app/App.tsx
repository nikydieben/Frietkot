import { MenuPage } from '../features/menu/MenuPage'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <span className="logo">🍟 Frietkot</span>
        {/* Routing-blok: navigatie naar menu en mandje. State-blok: mandje-badge. */}
      </header>

      <main className="app-main">
        <MenuPage />
      </main>

      <footer className="app-footer">Frietkot · React foundations voor .NET'ers</footer>
    </div>
  )
}
