import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { expect, test } from 'vitest'
import snacks from '../../mocks/data/snacks.json'
import { server } from '../../mocks/server'
import { renderRoute } from '../../test/render'
import { ASSISTANT_API } from './config'

/** Een antwoord van de backend in het UI message stream-protocol van de AI SDK, als één stap. */
function stream(...chunks: object[]) {
  const body = [{ type: 'start' }, { type: 'start-step' }, ...chunks, { type: 'finish-step' }, { type: 'finish' }]
    .map(chunk => `data: ${JSON.stringify(chunk)}\n\n`)
    .join('') + 'data: [DONE]\n\n'
  return new HttpResponse(body, {
    headers: { 'Content-Type': 'text/event-stream', 'x-vercel-ai-ui-message-stream': 'v1' },
  })
}

const text = (id: string, value: string) => [
  { type: 'text-start', id },
  { type: 'text-delta', id, delta: value },
  { type: 'text-end', id },
]

const toolCall = (toolCallId: string, toolName: string, input: object) => [
  { type: 'tool-input-start', toolCallId, toolName },
  { type: 'tool-input-available', toolCallId, toolName, input },
]

/** Elke request krijgt het volgende antwoord uit de lijst. Een extra request faalt meteen. */
function backendAnswers(...answers: (() => Response)[]) {
  let call = 0
  server.use(http.post(ASSISTANT_API, () =>
    answers[call++]?.() ?? new HttpResponse('Onverwachte extra request', { status: 500 })))
}

async function ask(question: string) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: '🍟 Vraag het de assistent' }))
  await user.type(screen.getByRole('textbox', { name: 'Bericht aan de assistent' }), question)
  await user.click(screen.getByRole('button', { name: 'Stuur' }))
  return screen.getByRole('complementary', { name: 'Frietkot-assistent' })
}

test('toont voorgestelde snacks als dezelfde kaarten als het menu en vult het mandje', async () => {
  const groteFriet = snacks.find(s => s.id === 'friet-groot')!
  backendAnswers(
    () => stream(
      ...text('t1', 'Kijk eens:'),
      ...toolCall('c1', 'showSnacks', { vegetarian: true }),
      { type: 'tool-output-available', toolCallId: 'c1', output: [groteFriet] },
      ...toolCall('c2', 'addToCart', { items: [{ id: 'friet-groot', quantity: 2 }] }),
    ),
    () => stream(...text('t2', 'Zit in je mandje!')),
  )
  renderRoute('/')

  const panel = await ask('We zijn met 2')

  expect(await within(panel).findByRole('heading', { name: 'Grote friet' })).toBeInTheDocument()
  expect(await screen.findByRole('link', { name: '2 items in je mandje' })).toBeInTheDocument()
  expect(await within(panel).findByText('Zit in je mandje!')).toBeInTheDocument()
})

test('navigeert naar het mandje en houdt de chat open', async () => {
  backendAnswers(
    () => stream(...toolCall('c1', 'navigate', { path: '/mandje' })),
    () => stream(...text('t1', 'Hier is je mandje.')),
  )
  const { router } = renderRoute('/')

  const panel = await ask('Toon mijn mandje')

  expect(await within(panel).findByText('Hier is je mandje.')).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/mandje')
})

test('toont een foutmelding als de backend onbereikbaar is, de rest van de app blijft werken', async () => {
  server.use(http.post(ASSISTANT_API, () => HttpResponse.error()))
  const user = userEvent.setup()
  renderRoute('/')

  const panel = await ask('Hallo?')

  expect(await within(panel).findByRole('alert')).toHaveTextContent('De assistent is even niet bereikbaar')
  await user.click(screen.getByRole('button', { name: 'Mayonaise toevoegen' }))
  expect(screen.getByRole('link', { name: '1 items in je mandje' })).toBeInTheDocument()
})
