import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai'
import { ASSISTANT_API } from './config'
// STAP 2: haal de // weg op de volgende 3 regels
// import { toSnack, type SnackDto } from '../../shared/api/snacks'
// import { SnackCard } from '../menu/SnackCard'
// import { useCart } from '../cart/CartContext'
// STAP 3: haal de // weg op de volgende regel
// import { useSnacks } from '../menu/useSnacks'
// STAP 4: haal de // weg op de volgende regel
// import { useNavigate } from 'react-router'

const transport = new DefaultChatTransport({ api: ASSISTANT_API })

/*
  OEFENING 5: FINALE, DE FRIETKOT-ASSISTENT (30 minuten, per 2)
  Vast? Kijk in SPIEKBRIEF.md onder "Finale".

  De chat werkt al: open het paneel, stel een vraag en kijk in de console wat er binnenkomt.
  Jij maakt de antwoorden zichtbaar en laat de assistent iets doen.

  STAP 1  Toon de tekst van elk bericht: loop over message.parts
          en toon part.text als part.type === 'text'.
  STAP 2  Toon de voorgestelde snacks: bij part.type === 'tool-showSnacks' en
          part.state === 'output-available' staan ze in part.output (een lijst SnackDto's).
          Zet ze om met toSnack en toon ze met dezelfde <SnackCard> als het menu.
          onAdd is de add-functie uit useCart().
  STAP 3  Laat de assistent het mandje vullen: werk addToCart uit in onToolCall hieronder.
  STAP 4  Laat de assistent navigeren: werk navigate uit in onToolCall hieronder.

  Je AI-tool mag hier volop helpen. De vraag is: begrijp je wat hij bouwde?
*/
export function AssistantPanel() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')

  const { messages, sendMessage, addToolOutput, status, error } = useChat({
    transport,
    // Na de client tools stuurt useChat het gesprek automatisch terug naar de backend.
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return

      if (toolCall.toolName === 'addToCart') {
        // STAP 3: toolCall.input is { items: [{ id: 'friet-groot', quantity: 2 }, ...] }.
        //         Zoek per item de snack op in de snacks van useSnacks()
        //         en roep add(snack) zo vaak op als quantity zegt.
        addToolOutput({ tool: 'addToCart', toolCallId: toolCall.toolCallId, output: { added: [] } })
      }

      if (toolCall.toolName === 'navigate') {
        // STAP 4: toolCall.input is { path: '/mandje' }. Navigeer met navigate(path) uit useNavigate().
        addToolOutput({ tool: 'navigate', toolCallId: toolCall.toolCallId, output: { ok: true } })
      }
    },
  })

  const busy = status === 'submitted' || status === 'streaming'
  console.log(messages)

  if (!open) {
    return (
      <button type="button" className="assistant-toggle button button--primary" onClick={() => setOpen(true)}>
        🍟 Vraag het de assistent
      </button>
    )
  }

  return (
    <aside className="assistant-panel" aria-label="Frietkot-assistent">
      <div className="assistant-panel__header">
        <h2>🍟 Frietkot-assistent</h2>
        <button type="button" className="button" onClick={() => setOpen(false)} aria-label="Sluit de assistent">✕</button>
      </div>

      <div className="chat-log">
        {messages.length === 0 && (
          <p className="chat-note">Vraag bijvoorbeeld: "We zijn met 4, budget 30 euro, 1 vegetariër"</p>
        )}
        {messages.map(message => (
          <div key={message.id} className={`chat-message chat-message--${message.role}`}>
            {/* STAP 1 en 2: toon hier de onderdelen van het bericht (message.parts) */}
            <span className="chat-note">(nog niet zichtbaar: zie stap 1)</span>
          </div>
        ))}
        {status === 'submitted' && <p className="chat-note">De assistent denkt na…</p>}
        {error && (
          <p className="state state--error" role="alert">De assistent is even niet bereikbaar. {error.message}</p>
        )}
      </div>

      <form
        className="chat-form"
        onSubmit={event => {
          event.preventDefault()
          if (!input.trim()) return
          sendMessage({ text: input })
          setInput('')
        }}
      >
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Vraag iets aan de assistent"
          aria-label="Bericht aan de assistent"
          disabled={busy}
        />
        <button type="submit" className="button button--primary" disabled={busy}>Stuur</button>
      </form>
    </aside>
  )
}
