import { CartSummary } from './CartSummary'
import { CheckoutForm } from './CheckoutForm'

export function CartPage() {
  return (
    <section>
      <h1>Mandje</h1>
      <CartSummary />
      <CheckoutForm />
    </section>
  )
}
