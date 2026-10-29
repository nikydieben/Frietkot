# 🍟 Spiekbrief React

Kort en met code, om naast je te leggen. Het voorbeeld van C# of Blazor helpt je het te plaatsen.

## Foundations

### Een component is een functie

```tsx
export function Welcome() {
  return <h1>Welkom bij Frietkot</h1>
}

// Gebruiken, zoals een HTML-tag:
<Welcome />
```

Een component is een functie die UI teruggeeft. Vergelijk met een Razor component.

### JSX en TSX

JSX zijn tags in JavaScript, geen HTML. Vite maakt er gewone functie-aanroepen van. Een `.tsx`-bestand is TypeScript met JSX, zoals een `.razor`-bestand C# met markup is.

- `class` heet `className`: `<p className="snack-card__price">`
- Tussen `{ }` staat één JavaScript-expressie, iets dat een waarde oplevert: `<h2>{snack.name}</h2>`. In een `.tsx`-bestand controleert TypeScript die.
- Geen `if` of `for` tussen `{ }`: gebruik `&&`, `? :` en `.map()`. Razor heeft `@if` en `@foreach`, JSX niet.
- Eén root-element. Meerdere naast elkaar? Zet ze in `<>…</>`

### Props: de parameters van een component

```tsx
type GreetingProps = { name: string }

export function Greeting({ name }: GreetingProps) {
  return <p>Hallo, {name}!</p>
}

<Greeting name="Niky" />
```

React geeft alle props samen door in één object. Een prop zelf mag alles zijn: tekst, een getal, JSX, een functie. `{ name }` haalt `name` uit dat object (destructuring). Zonder destructuring schrijf je `Greeting(props: GreetingProps)` en `props.name`.

In Blazor: `[Parameter] public string Name { get; set; }`

### Iets enkel tonen als…

```tsx
{snack.vegetarian && <span className="tag-veggie">vegetarisch</span>}
```

Is `snack.vegetarian` true, dan verschijnt het label. Anders niets.

### Lijsten: `.map()` met een `key`

```tsx
<ul>
  {snacks.map(snack => (
    <li key={snack.id}>{snack.name}</li>
  ))}
</ul>
```

`.map()` is `Select` uit LINQ. De `key` is een vaste id, zodat React weet welk item welk is (zoals `@key` in Blazor). React vergelijkt oud en nieuw per key. Is een key dubbel, of gebruik je de index, dan raken items door elkaar en belandt state bij het verkeerde item. Uniek binnen de lijst volstaat.

### Events en functies als prop

```tsx
type AddButtonProps = { onAdd: () => void }

export function AddButton({ onAdd }: AddButtonProps) {
  return <button onClick={onAdd}>Toevoegen</button>
}
```

Een functie als prop is zoals een `EventCallback` in Blazor.

### Hooks: functies die met `use` beginnen

```tsx
export function MenuPage() {
  const result = useSnacks()  // een eigen hook, met useState en useEffect erin
}
```

Een hook geeft je component state, effecten of context. Eigen hooks bundelen andere hooks. Roep hooks enkel bovenaan je component aan, nooit in een `if`, een lus of na een `return`: React herkent ze aan hun volgorde. In Blazor doet een lifecycle-methode of een `@inject`-service iets gelijkaardigs.

## State management

### `useState`: een waarde die de UI bijwerkt

```tsx
const [count, setCount] = useState(0)

<button onClick={() => setCount(count + 1)}>{count}</button>
```

Pas state nooit rechtstreeks aan (`count++`): gebruik altijd de setter. Voor een lijst maak je een nieuwe lijst:

```tsx
setLines(current => addSnack(current, snack))
```

### Lifting state up

Hebben twee componenten dezelfde state nodig? Zet die state in hun gemeenschappelijke ouder en geef hem via props door.

### Derived state: berekenen, niet opslaan

```tsx
const count = lines.reduce((sum, line) => sum + line.quantity, 0)
```

In C#: `lines.Sum(l => l.Quantity)`. Kan je het berekenen? Sla het dan niet apart op.

### Context: delen zonder props door te geven

```tsx
const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  return <CartContext value={{ lines, setLines }}>{children}</CartContext>
}

export function useCart() {
  const cart = use(CartContext)
  if (!cart) throw new Error('useCart werkt enkel binnen een CartProvider')
  return cart
}

// Overal binnen de provider:
const { lines } = useCart()
```

Vergelijk met een service die je via DI krijgt, of met `[CascadingParameter]` in Blazor.

### Server state: `useQuery`

```tsx
const { status, data, error } = useQuery({ queryKey: ['snacks'], queryFn: getSnacks })
```

## Routing

### Routes op één plek

```tsx
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MenuPage /> },
      { path: 'snack/:id', element: <SnackDetailPage /> },
    ],
  },
]

// main.tsx
const router = createBrowserRouter(routes)
<RouterProvider router={router} />
```

In Blazor: `@page "/snack/{id}"`.

### Een layout met `<Outlet />`

```tsx
<main><Outlet /></main>
```

Daar komt de pagina van de huidige route. In Blazor: `@Body` in `MainLayout.razor`.

### Een parameter uit de URL

```tsx
const { id } = useParams()
```

### Links

```tsx
<NavLink to="/mandje">Mandje</NavLink>
<Link to={`/snack/${snack.id}`}>{snack.name}</Link>
```

### State in de URL

```tsx
const [searchParams, setSearchParams] = useSearchParams()
const category = searchParams.get('categorie')

setSearchParams({ categorie: 'frieten' })
```

## Testing

### Een test

```ts
import { expect, test } from 'vitest'

test('twee plus twee is vier', () => {
  expect(2 + 2).toBe(4)
})
```

Vergelijk met een `[Fact]` met `Assert.Equal` in xUnit.

- `toBe(x)`: exact gelijk, voor getallen en tekst
- `toEqual(x)`: dezelfde inhoud, voor objecten en lijsten
- Draaien: `npm run test:watch`

### Een component testen

```tsx
renderRoute('/')
await user.click(await screen.findByRole('button', { name: 'Grote friet toevoegen' }))
expect(screen.getByRole('link', { name: '1 items in je mandje' })).toBeInTheDocument()
```

Zoek zoals een gebruiker: op rol en op naam.
