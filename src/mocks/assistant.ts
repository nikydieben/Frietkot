import { delay, HttpResponse } from 'msw'
import type { SnackCategory, SnackDto } from '../shared/api/snacks'
import { formatPrice } from '../shared/format'

/*
  Nep-assistent voor de finale: speelt de backend (frietkot-api) na, zonder AI.
  Hij herkent maar een paar soorten vragen, maar spreekt hetzelfde protocol
  (het UI message stream-protocol van de AI SDK) met dezelfde tools.
*/

type Part = { type: string; text?: string; input?: unknown; output?: unknown }
export type ChatMessage = { role: string; parts: Part[] }

type CartItem = { id: string; quantity: number }
type Filter = { vegetarian?: boolean; maxPrice?: number; category?: SnackCategory }

type Event =
  | { text: string }
  | { tool: 'showSnacks'; input: Filter; output: SnackDto[] }
  | { tool: 'addToCart'; input: { items: CartItem[] } }
  | { tool: 'navigate'; input: { path: string } }

/**
 * Een antwoord bestaat uit stappen. Eindigt de laatste stap met een client tool
 * (addToCart, navigate), dan voert useChat die uit en stuurt het gesprek terug.
 */
export type Step = Event[]

const HELP =
  'Ik ben de oefen-assistent van de Frietkot: geen echte AI, ik ken maar een paar vragen. Probeer: ' +
  '"We zijn met 4, budget 30 euro, 1 vegetariër", "Wat is er vegetarisch?", "Doe er 2 grote frieten bij" of "Toon mijn mandje".'

const NOT_ON_MENU = ['sushi', 'pizza', 'pasta', 'burger', 'kebab', 'salade']

const NUMBER_WORDS: Record<string, number> = { een: 1, twee: 2, drie: 3, vier: 4, vijf: 5, zes: 6, zeven: 7, acht: 8 }
const NUMBER = `(\\d+|${Object.keys(NUMBER_WORDS).join('|')})`

// Waaraan de nep-assistent een snack herkent. De langste eerst: "middelgrote friet" bevat "grote friet".
const SNACK_WORDS: [id: string, word: string][] = [
  ['friet-medium', 'middelgrote friet'],
  ['friet-klein', 'kleine friet'],
  ['friet-groot', 'grote friet'],
  ['frikandel', 'frikandel'],
  ['bitterballen', 'bitterbal'],
  ['kaaskroket', 'kaaskroket'],
  ['mexicano', 'mexicano'],
  ['loempia-veggie', 'loempia'],
  ['boulet', 'boulet'],
  ['mayo', 'mayo'],
  ['andalouse', 'andalouse'],
  ['samurai', 'samurai'],
  ['stoofvleessaus', 'stoofvlees'],
]

export function fakeAssistant(messages: ChatMessage[], snacks: SnackDto[]): Step[] {
  const last = messages.at(-1)
  if (!last) return [[{ text: HELP }]]
  if (last.role === 'assistant') return [[{ text: afterClientTool(last) }]]

  const question = normalize(last.parts.map(part => part.text ?? '').join(' '))
  const priceOf = (id: string) => snacks.find(s => s.id === id)?.price_eur ?? 0

  const notOnMenu = NOT_ON_MENU.find(word => question.includes(word))
  if (notOnMenu) {
    return [[{ text: `${capitalize(notOnMenu)}? Daarvoor zit je hier verkeerd, makker. Bij ons is het frieten, snacks en sauzen. Vraag gerust wat er vegetarisch is.` }]]
  }

  const people = matchNumber(question, new RegExp(`\\b(?:met|voor)\\s+${NUMBER}\\b(?!\\s*(?:euro|eur|€))`))
  if (people) return groupOrder(people, question, snacks, priceOf)

  const items = namedSnacks(question)
  if (items.length > 0) {
    const total = items.reduce((sum, item) => sum + item.quantity * priceOf(item.id), 0)
    return [[{ text: `Komt eraan! Samen ${formatPrice(total)}.` }, { tool: 'addToCart', input: { items } }]]
  }

  if (question.includes('mandje')) {
    return [[{ text: 'Ik toon je mandje.' }, { tool: 'navigate', input: { path: '/mandje' } }]]
  }

  const filter = parseFilter(question)
  if (filter || question.includes('menu')) {
    const found = filterSnacks(snacks, filter ?? {})
    return [
      [
        { text: found.length > 0 ? 'Kijk eens wat ik vond:' : 'Daar heb ik niets voor op het menu.' },
        { tool: 'showSnacks', input: filter ?? {}, output: found },
      ],
      [{ text: 'Zal ik er iets van in je mandje stoppen? Zeg bijvoorbeeld "Doe er 2 kaaskroketten bij".' }],
    ]
  }

  return [[{ text: HELP }]]
}

/** Bv. "We zijn met 4, budget 30 euro, 1 vegetariër": friet en een snack per persoon, binnen het budget. */
function groupOrder(people: number, question: string, snacks: SnackDto[], priceOf: (id: string) => number): Step[] {
  const vegetarians = Math.min(people, matchNumber(question, new RegExp(`\\b${NUMBER}\\s+(?:vegetarier|veggie)`)) ?? 0)
  const budget = parseBudget(question)

  const order = (friet: string, sauce: boolean): CartItem[] =>
    [
      { id: friet, quantity: people },
      { id: 'frikandel', quantity: people - vegetarians },
      { id: 'kaaskroket', quantity: vegetarians },
      { id: 'mayo', quantity: sauce ? people : 0 },
    ].filter(item => item.quantity > 0)
  const totalOf = (items: CartItem[]) => items.reduce((sum, item) => sum + item.quantity * priceOf(item.id), 0)

  // Van ruim naar zuinig: de eerste die in het budget past.
  const options = [order('friet-medium', true), order('friet-klein', true), order('friet-klein', false)]
  const items = options.find(option => budget === undefined || totalOf(option) <= budget) ?? options.at(-1)!
  const total = totalOf(items)

  const who = `${people} ${people === 1 ? 'persoon' : 'personen'}` +
    (vegetarians > 0 ? `, waarvan ${vegetarians} ${vegetarians === 1 ? 'vegetariër' : 'vegetariërs'}` : '')
  const list = items.map(item => `${item.quantity}× ${snacks.find(s => s.id === item.id)?.display_name ?? item.id}`).join(', ')
  const overBudget = budget !== undefined && total > budget ? ` Dat is wel meer dan ${formatPrice(budget)}, sorry.` : ''

  const veggie: Filter = { vegetarian: true, category: 'snacks' }
  const frieten: Filter = { category: 'frieten' }
  const shown = vegetarians > 0 ? veggie : frieten

  return [[
    { text: `Voor ${who}: ${list}. Samen ${formatPrice(total)}.${overBudget} ${vegetarians > 0 ? 'Dit is er vegetarisch:' : 'Onze frieten:'}` },
    { tool: 'showSnacks', input: shown, output: filterSnacks(snacks, shown) },
    { text: 'Ik stop de bestelling in je mandje.' },
    { tool: 'addToCart', input: { items } },
  ]]
}

/** Het antwoord nadat de browser een client tool uitvoerde. */
function afterClientTool(message: ChatMessage): string {
  const tool = message.parts.findLast(part => part.type.startsWith('tool-'))
  if (tool?.type === 'tool-addToCart') {
    const { added = [] } = (tool.output ?? {}) as { added?: string[] }
    return added.length > 0
      ? 'Zit in je mandje! Zeg "toon mijn mandje" om het te bekijken.'
      : 'Hmm, er kwam niets in je mandje. Werkt addToCart al? Kijk bij stap 3.'
  }
  if (tool?.type === 'tool-navigate') return 'Voilà, je mandje. Smakelijk! 🍟'
  return HELP
}

function namedSnacks(question: string): CartItem[] {
  const items: CartItem[] = []
  let rest = question
  for (const [id, word] of SNACK_WORDS) {
    const index = rest.indexOf(word)
    if (index === -1) continue
    const quantity = matchNumber(rest.slice(0, index), new RegExp(`\\b${NUMBER}\\s+$`)) ?? 1
    items.push({ id, quantity })
    rest = rest.slice(0, index) + rest.slice(index + word.length)
  }
  return items
}

function parseFilter(question: string): Filter | undefined {
  const filter: Filter = {}
  if (question.includes('veg')) filter.vegetarian = true
  if (question.includes('goedkoop')) filter.maxPrice = 3
  const budget = parseBudget(question)
  if (budget !== undefined) filter.maxPrice = budget
  if (question.includes('friet')) filter.category = 'frieten'
  else if (question.includes('saus') || question.includes('sauzen')) filter.category = 'sauzen'
  else if (question.includes('snack')) filter.category = 'snacks'
  return Object.keys(filter).length > 0 ? filter : undefined
}

/** Hetzelfde filter als showSnacks in frietkot-api. */
function filterSnacks(snacks: SnackDto[], { vegetarian, maxPrice, category }: Filter): SnackDto[] {
  return snacks
    .filter(s => !vegetarian || s.is_vegetarian)
    .filter(s => maxPrice === undefined || s.price_eur <= maxPrice)
    .filter(s => !category || s.category === category)
}

function parseBudget(question: string): number | undefined {
  const match = question.match(/(\d+(?:[.,]\d+)?)\s*(?:euro|eur|€)|€\s*(\d+(?:[.,]\d+)?)/)
  const amount = match?.[1] ?? match?.[2]
  return amount === undefined ? undefined : Number(amount.replace(',', '.'))
}

function matchNumber(text: string, pattern: RegExp): number | undefined {
  const value = text.match(pattern)?.[1]
  if (value === undefined) return undefined
  return NUMBER_WORDS[value] ?? Number(value)
}

/** Kleine letters en zonder accenten: "Vegetariër" -> "vegetarier". */
function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(1)
}

/** Zet de stappen om naar een stream in het UI message stream-protocol, woord per woord. */
export function streamSteps(steps: Step[]): Response {
  const encoder = new TextEncoder()
  const body = new ReadableStream({
    async start(controller) {
      const send = (chunk: object) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      send({ type: 'start' })
      for (const step of steps) {
        send({ type: 'start-step' })
        for (const event of step) {
          if ('text' in event) {
            const id = crypto.randomUUID()
            send({ type: 'text-start', id })
            for (const word of event.text.split(/(?=\s)/)) {
              await delay(30)
              send({ type: 'text-delta', id, delta: word })
            }
            send({ type: 'text-end', id })
            continue
          }
          const toolCallId = crypto.randomUUID()
          send({ type: 'tool-input-start', toolCallId, toolName: event.tool })
          send({ type: 'tool-input-available', toolCallId, toolName: event.tool, input: event.input })
          if ('output' in event) {
            await delay(300)
            send({ type: 'tool-output-available', toolCallId, output: event.output })
          }
        }
        send({ type: 'finish-step' })
      }
      send({ type: 'finish' })
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
  return new HttpResponse(body, {
    headers: { 'Content-Type': 'text/event-stream', 'x-vercel-ai-ui-message-stream': 'v1' },
  })
}
