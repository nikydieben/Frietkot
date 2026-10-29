import { MenuPage } from '../features/menu/MenuPage'
// STAP 1: haal de // weg op de volgende regels
// import { useState } from 'react'
// import type { Snack } from '../shared/api/snacks'
// import { addSnack } from '../features/cart/cartLines'
// import type { CartLine } from '../features/cart/types'
// import { CartSummary } from '../features/cart/CartSummary'

/*
  OEFENING 2: STATE MANAGEMENT (22 minuten, per 2)
  Vast? Kijk in SPIEKBRIEF.md onder "State management".

  STAP 1  Maak het mandje met useState, hieronder in App:
            const [lines, setLines] = useState<CartLine[]>([])
  STAP 2  Schrijf een functie die een snack toevoegt (addSnack staat klaar):
            function add(snack: Snack) { setLines(current => addSnack(current, snack)) }
  STAP 3  Geef die functie door aan het menu: <MenuPage onAdd={add} />
          Test: zet console.log(lines) in App en klik op "Toevoegen". In de console van de browser groeit de lijst.
  STAP 4  Toon het aantal stuks in de header, met de klasse cart-badge.
          Het aantal is derived state: tel de quantity van alle lijnen op met reduce.
  STAP 5  Toon het mandje onder het menu: <CartSummary lines={lines} />
          en vul in CartSummary.tsx het totaal in.
  STAP 6  Als er tijd is: geef je nu veel door via props? De CartProvider in
          features/cart/CartContext.tsx doet hetzelfde met Context. Zet <CartProvider>
          rond de app en haal het mandje op met useCart() waar je het nodig hebt.

  Bonus: hetzelfde mandje met Jotai (zie BONUS.md).
*/
export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <span className="logo">🍟 Frietkot</span>
        {/* STAP 4: het aantal stuks in je mandje */}
      </header>

      <main className="app-main">
        {/* STAP 3: geef hier jouw functie mee: onAdd={add} */}
        <MenuPage onAdd={snack => console.info(`${snack.name} toevoegen`)} />
        {/* STAP 5: het mandje */}
      </main>

      <footer className="app-footer">Frietkot · React foundations voor .NET'ers</footer>
    </div>
  )
}
