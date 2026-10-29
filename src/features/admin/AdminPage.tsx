import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSnackPrice, type Snack } from '../../shared/api/snacks'
import { useSnacks } from '../menu/useSnacks'

export function AdminPage() {
  const { status, data: snacks, error } = useSnacks()

  return (
    <section>
      <h1>Prijzen beheren</h1>
      {status === 'pending' && <p className="state state--loading">Snacks laden…</p>}
      {status === 'error' && <p className="state state--error" role="alert">{error.message}</p>}
      {status === 'success' && (
        <table className="admin-table">
          <thead>
            <tr><th>Snack</th><th>Prijs (€)</th><th /></tr>
          </thead>
          <tbody>
            {snacks.map(snack => <PriceRow key={snack.id} snack={snack} />)}
          </tbody>
        </table>
      )}
    </section>
  )
}

function PriceRow({ snack }: { snack: Snack }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (price: number) => updateSnackPrice(snack.id, price),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snacks'] }),
  })

  return (
    <tr>
      <td>{snack.emoji} {snack.name}</td>
      <td colSpan={2}>
        <form
          onSubmit={event => {
            event.preventDefault()
            const price = Number(new FormData(event.currentTarget).get('price'))
            mutation.mutate(price)
          }}
        >
          <input name="price" type="number" step="0.1" min="0" defaultValue={snack.price} aria-label={`Prijs van ${snack.name}`} />{' '}
          <button type="submit" className="button" disabled={mutation.isPending} aria-label={`Prijs van ${snack.name} opslaan`}>
            {mutation.isPending ? 'Opslaan…' : 'Opslaan'}
          </button>
        </form>
      </td>
    </tr>
  )
}
