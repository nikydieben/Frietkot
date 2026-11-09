import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { getOrder } from '../../shared/api/orders'

/** De bevestiging van een bestelling, op /bestelling/:nummer. */
export function OrderPage() {
  const { nummer } = useParams()
  const { status, data: order, error } = useQuery({
    queryKey: ['order', nummer],
    queryFn: () => getOrder(Number(nummer)),
    retry: false, // een onbekende bestelling wordt niet beter door opnieuw te proberen
  })

  if (status === 'pending') return <p className="state state--loading">Bestelling laden…</p>
  if (status === 'error') {
    return (
      <section className="empty-state">
        <h1>{error.message}</h1>
        <Link to="/">Terug naar het menu</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Bedankt, {order.name}!</h1>
      <p className="confirmation" role="status">
        {order.address
          ? `Bestelling ${order.number} wordt om ${order.time} geleverd op ${order.address}`
          : `Bestelling ${order.number} staat klaar om ${order.time}`}
      </p>
      <p>{order.itemCount} items · <Link to="/">Terug naar het menu</Link></p>
    </section>
  )
}
