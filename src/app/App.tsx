import { MenuPage } from '../features/menu/MenuPage'
// STAP 1: haal de // weg op de volgende regels
// import { useState } from 'react'
// import type { Snack } from '../shared/api/snacks'
// import { addSnack } from '../features/cart/cartLines'
// import type { CartLine } from '../features/cart/types'
// import { CartSummary } from '../features/cart/CartSummary'

/*
  OEFENING 2: STATE MANAGEMENT (22 minuten)
  Vast? Kijk in SPIEKBRIEF.md onder "State management".

  STAP 1  Maak het mandje als state in App: een lijst van CartLine-objecten die leeg begint.
  STAP 2  Schrijf een functie add die een snack aan het mandje toevoegt.
          addSnack uit cartLines.ts doet het rekenwerk al.
  STAP 3  Geef add door aan MenuPage: die heeft er een prop voor.
          Test: zet console.log(lines) in App en klik op "Toevoegen". In de console van de browser groeit de lijst.
  STAP 4  Toon het aantal stuks in de header, met de klasse cart-badge.
          Het aantal is derived state: je berekent het uit het mandje.
  STAP 5  Toon het mandje onder het menu met CartSummary, en vul in CartSummary.tsx het totaal in.
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
        {/* STAP 3: geef hier jouw functie mee aan MenuPage */}
        <MenuPage onAdd={snack => console.info(`${snack.name} toevoegen`)} />
        {/* STAP 5: het mandje */}
      </main>

      <footer className="app-footer">Frietkot · React foundations voor .NET'ers</footer>
    </div>
  )
}
