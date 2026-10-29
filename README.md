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

| Branch        | Blok                       |
| ------------- | -------------------------- |
| `01-start`    | Foundations                |
| `02-state`    | State management           |
| `03-routing`  | Routing                    |
| `04-bundling` | Bundling                   |
| `05-testing`  | Testing                    |
| `06-finale`   | Finale: Frietkot-assistent |
| `solution`    | Alles af                   |

## Projectstructuur

Feature-first: alles van één feature staat samen.

```
src/
  app/            layout van de app
  features/
    menu/         menu en snackkaarten
    cart/         mandje
    admin/        prijzen beheren
    assistant/    chat (finale)
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
| `chat`, `chat-log`, `chat-message--user/--assistant`, `chat-form` | Chat (finale)         |

## In de browser werken

Lukt het lokaal niet? Open je branch in StackBlitz, zonder iets te installeren:

| Branch        | StackBlitz |
| ------------- | ---------- |
| `01-start`    | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/01-start) |
| `02-state`    | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/02-state) |
| `03-routing`  | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/03-routing) |
| `04-bundling` | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/04-bundling) |
| `05-testing`  | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/05-testing) |
| `06-finale`   | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/06-finale) |
| `solution`    | [openen](https://stackblitz.com/github/nikydieben/Frietkot/tree/solution) |

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

Voor het AI-moment zet je ze gewoon weer aan.
