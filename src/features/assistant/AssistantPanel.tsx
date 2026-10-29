import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls, type UIMessage } from 'ai'
import { toSnack, type SnackDto } from '../../shared/api/snacks'
import { useCart } from '../cart/CartContext'
import { SnackCard } from '../menu/SnackCard'
import { useSnacks } from '../menu/useSnacks'
import { ASSISTANT_API } from './config'

type CartItem = { id: string; quantity: number }

const transport = new DefaultChatTransport({ api: ASSISTANT_API })

/** De chat staat in de layout, zodat hij open blijft als de assistent navigeert. */
export function AssistantPanel() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const { add } = useCart()
  const { data: snacks = [] } = useSnacks()

  const { messages, sendMessage, addToolOutput, status, error } = useChat({
    transport,
    // Na de client tools stuurt useChat het gesprek automatisch terug naar de backend.
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    // useChat roept altijd de nieuwste versie van deze functie op: snacks en add zijn up-to-date.
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return

      if (toolCall.toolName === 'addToCart') {
        const { items } = toolCall.input as { items: CartItem[] }
        const added: string[] = []
        for (const { id, quantity } of items) {
          const snack = snacks.find(s => s.id === id)
          if (!snack) continue
          for (let i = 0; i < quantity; i++) add(snack)
          added.push(id)
        }
        addToolOutput({ tool: 'addToCart', toolCallId: toolCall.toolCallId, output: { added } })
      }

      if (toolCall.toolName === 'navigate') {
        const { path } = toolCall.input as { path: string }
        navigate(path)
        addToolOutput({ tool: 'navigate', toolCallId: toolCall.toolCallId, output: { ok: true } })
      }
    },
  })

  const busy = status === 'submitted' || status === 'streaming'

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
            {message.parts.map((part, index) => <MessagePart key={index} part={part} onAdd={add} />)}
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

type MessagePartProps = {
  part: UIMessage['parts'][number]
  onAdd: Parameters<typeof SnackCard>[0]['onAdd']
}

function MessagePart({ part, onAdd }: MessagePartProps) {
  switch (part.type) {
    case 'text':
      return <span>{part.text}</span>
    case 'tool-showSnacks':
      if (part.state !== 'output-available') return <p className="chat-note">Even in het menu kijken…</p>
      // Dezelfde SnackCard als op het menu: AI-features zijn gewoon React.
      return (
        <ul className="snack-grid">
          {(part.output as SnackDto[]).map(toSnack).map(snack => (
            <SnackCard key={snack.id} snack={snack} onAdd={onAdd} />
          ))}
        </ul>
      )
    case 'tool-addToCart':
      return part.state === 'output-available' ? <p className="chat-note">🛒 In je mandje gestoken</p> : null
    default:
      return null
  }
}
