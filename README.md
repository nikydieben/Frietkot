# 🍟 Frietkot

Oefenapp voor de workshop *React foundations voor .NET'ers*.

## Starten

Vereist Node 22 (zie `.nvmrc`, met nvm: `nvm use`).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # alle tests, eenmalig
npm run test:watch # tests in watch-modus
```

## Branches

Elke branch is de beginsituatie van een blok. Loop je achter? Check de volgende branch uit en je bent weer mee.

Bij elk blok hoort ook een oplossing. `git diff 01-start 01-solution` toont precies wat je moest doen.

| Branch         | Blok                       | Oplossing     |
| -------------- | -------------------------- | ------------- |
| `01-start`     | Foundations                | `01-solution` |
| `02-state`     | State management           | `02-solution` |
| `03-effects`   | Effects                    | `03-solution` |
| `04-routing`   | Routing                    | `04-solution` |
| `05-bestellen` | Formulieren: bestellen     | `05-solution` |
| `06-testing`   | Testing (demo)             | `06-solution` |
| `07-bundling`  | Bundling (demo)            | `07-solution` |
| `solution`     | Alles af (= `07-solution`) |               |

### Wisselen van branch

Bij de start van elke oefening wissel je naar de branch van die oefening. Zet eerst je eigen werk opzij, anders weigert git:

```bash
git stash -u          # je werk opzij (terughalen kan met git stash pop)
git switch 02-state   # de branch van de oefening
```

## Projectstructuur

Feature-first: alles van één feature staat samen.

```
src/
  app/            layout van de app
  features/
    menu/         menu en snackkaarten
    cart/         mandje
    admin/        prijzen beheren
  shared/api/     API-laag: fetch + DTO-mapping
  mocks/          nep-API (MSW), ook gebruikt in de tests
```

Components roepen nooit zelf `fetch` aan. Ze gebruiken de API-laag, die de DTO van de API omzet naar het model van de UI.

## Nep-API

Er is geen echte backend: [MSW](https://mswjs.io) speelt `/api/snacks` na in de browser, ook zonder internet. De tests gebruiken dezelfde handlers.

Foutstatus bekijken? Open de app met `?api=fout`.

## CSS

Je hoeft geen CSS te schrijven. Alle klassen staan klaar in `src/index.css`:

| Klasse                                                         | Gebruik                  |
| -------------------------------------------------------------- | ------------------------ |
| `snack-grid`, `snack-card`, `snack-card__emoji/__name/__price` | Menu met snackkaarten    |
| `tag-veggie`                                                   | Label "vegetarisch"      |
| `chips`, `chip`, `chip--active`                                | Filter op categorie      |
| `button`, `button--primary`                                    | Knoppen                  |
| `app-nav`, `cart-badge`                                        | Navigatie en mandje-badge |
| `cart`, `cart-line`, `cart-line__name/__quantity`, `cart-total` | Mandje                   |
| `detail`, `detail__emoji`                                      | Detailpagina             |
| `state state--loading`, `state state--error`, `empty-state`    | Laden, fout, leeg        |
| `admin-table`                                                  | Prijzen beheren          |
| `checkout`, `field`, `field__error`, `choice`, `confirmation`  | Bestellen                |

## In de browser werken

Lukt het lokaal niet? Open je branch in StackBlitz, zonder iets te installeren:

| Branch         | StackBlitz |
| -------------- | ---------- |
| `01-start`     | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/01-start) |
| `02-state`     | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/02-state) |
| `03-effects`   | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/03-effects) |
| `04-routing`   | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/04-routing) |
| `05-bestellen` | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/05-bestellen) |
| `06-testing`   | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/06-testing) |
| `07-bundling`  | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/07-bundling) |
| `solution`     | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/solution) |

## Spiekbrief

Vast op een begrip? [SPIEKBRIEF.md](SPIEKBRIEF.md) vat per blok samen wat je nodig hebt, met code.

## Bonusopdrachten

Vroeg klaar? Zie [BONUS.md](BONUS.md).

## AI-suggesties uitzetten

Tijdens "zelf doen" staan de inline suggesties van je AI-tool uit, anders typt de AI de oefening voor je. Chat mag blijven. De exacte naam van de optie verschilt per versie.

- **GitHub Copilot (VS Code):** klik op het Copilot-icoon in de statusbalk en zet de inline suggesties (completions) uit
- **Cursor:** zet Cursor Tab uit, via het icoon rechtsonder of in de Cursor-instellingen
- **JetBrains AI Assistant:** zet de inline code completion uit in de instellingen van AI Assistant
- **Claude Code:** geeft geen inline suggesties, hier hoef je niets te doen

Voor de bonusopdrachten met AI zet je ze gewoon weer aan.
