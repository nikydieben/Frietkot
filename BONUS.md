# 🍟 Bonusopdrachten

Vroeg klaar met de oefening? Doe dan de bonusopdracht van het blok. Je mag je eigen AI-tool gebruiken.

## Foundations: jij bent de reviewer

1. Vraag je AI-tool: *"Maak een React-component SnackCard dat een snack toont met emoji, naam, prijs, categorie, een label 'vegetarisch' en een knop 'Toevoegen'."*
2. Leg het resultaat naast je eigen `SnackCard` en loop de checklist af.
3. Wat zou je zeggen in een pull request-review?

**Review-checklist**

- [ ] Elk item in een lijst heeft een stabiele `key` (geen index)
- [ ] De klikbare actie is een `<button>`, geen `<div onClick>`
- [ ] De props zijn getypeerd (geen `any`)
- [ ] Namen zijn duidelijk: component, props en handlers zoals `onAdd`
- [ ] Het component haalt zelf geen data op (dumb component)

## Routing: context engineering

1. Vraag je AI-tool: *"Voeg een pagina /bestellingen toe met een lijst van mijn vorige bestellingen."*
2. Volgt het resultaat de conventies van dit project? Routes in `routes.tsx`, gedeelde state via `useCart()`, data via TanStack Query, tests met `getByRole`.
3. Gooi de wijzigingen weg (`git restore . && git clean -fd src`) en zet het instructions file aan. Hernoem daarvoor het bestand dat jouw tool leest:
   - Claude Code: `CLAUDE.md.off` → `CLAUDE.md`
   - GitHub Copilot: `.github/copilot-instructions.md.off` → `.github/copilot-instructions.md`
   - Andere tools (Cursor, …): `AGENTS.md.off` → `AGENTS.md`
4. Stel dezelfde vraag opnieuw en vergelijk de twee resultaten.

## State: hetzelfde mandje met Jotai

[Jotai](https://jotai.org) is al geïnstalleerd. Het werkt als een `useState` die je in de hele app kan delen, zonder Provider.

1. Maak `src/features/cart/cartAtom.ts`:
   ```ts
   import { atom } from 'jotai'
   import type { CartLine } from './types'

   export const linesAtom = atom<CartLine[]>([])
   ```
2. Gebruik in je componenten `const [lines, setLines] = useAtom(linesAtom)` in plaats van `useCart()`.
3. Vergelijk met Context: wat valt weg, en wat blijft hetzelfde?
