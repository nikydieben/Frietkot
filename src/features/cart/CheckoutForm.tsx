import { useState, type FormEvent, type ReactNode } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { placeOrder } from '../../shared/api/orders'
import { useCart } from './CartContext'

/*
  OEFENING 5: BESTELLEN (20 minuten)
  Vast? Kijk in SPIEKBRIEF.md onder "Formulieren".

  STAP 1  Maak een formulier met je naam en een tijdstip (een input van type time).
          Elk veld is een controlled input: de waarde zit in state.
          Tip: een klein Field-component (label, veld en fout eronder) scheelt herhaling. Zie SPIEKBRIEF.md.
  STAP 2  Controleer bij het versturen: een naam is verplicht, en het tijdstip ligt tussen 17:00 en 21:00.
          Toon een fout onder het veld (klasse field__error) en koppel ze met aria-describedby,
          zodat een schermlezer ze voorleest. Is er een fout? Dan verstuur je niets.
  STAP 3  Verstuur de bestelling met placeOrder uit shared/api/orders.ts, via useMutation.
          Zonder stap 6 is er nog geen adres: geef address: null mee.
          Tijdens het versturen staat de knop uit en toont hij "Bezig…". Mislukt het? Toon de fout.
  STAP 4  Gelukt? Maak het mandje leeg met clear() uit useCart(), en ga met useNavigate naar /bestelling/<nummer>.
  STAP 5  OrderPage.tsx: lees het nummer uit de URL (de route is bestelling/:nummer), haal de bestelling
          op met getOrder(Number(nummer)) via useQuery, en toon "Bestelling 1 staat klaar om 18:30".
  STAP 6  Als er tijd is: kies tussen afhalen en levering: twee radio buttons in een <fieldset>
          met een <legend> (klasse choice). Bij levering verschijnt een adresveld, en dan is een adres verplicht.

  Is je mandje leeg? Dan toon je geen formulier.
  De klassen checkout, field, field__error, choice en confirmation staan klaar in index.css.
  De nep-API onthoudt bestellingen tot je de pagina herlaadt: na F5 is bestelling 1 "niet gevonden".
*/

type Method = 'afhalen' | 'levering'
type Errors = { name?: string; time?: string; address?: string }

/** Valideren is gewone code: een functie die de fouten teruggeeft. */
function validate(name: string, time: string, method: Method, address: string): Errors {
  const errors: Errors = {}
  if (!name.trim()) errors.name = 'Vul je naam in'
  if (!time || time < '17:00' || time > '21:00') errors.time = 'Kies een tijdstip tussen 17:00 en 21:00'
  if (method === 'levering' && !address.trim()) errors.address = 'Vul je adres in'
  return errors
}

/** Een label, het veld zelf, en de fout eronder. */
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="field__error">{error}</p>}
    </div>
  )
}

/** aria-invalid en aria-describedby: een schermlezer leest de fout voor bij het veld. */
function errorProps(id: string, error?: string) {
  return error ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` } : {}
}

export function CheckoutForm() {
  const { lines, clear } = useCart()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [method, setMethod] = useState<Method>('afhalen')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const mutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: order => {
      clear()
      navigate(`/bestelling/${order.number}`)
    },
  })

  if (lines.length === 0) return null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(name, time, method, address)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    mutation.mutate({ name: name.trim(), time, address: method === 'levering' ? address.trim() : null, lines })
  }

  return (
    <form className="checkout" aria-label="Bestellen" noValidate onSubmit={handleSubmit}>
      <h2>Bestellen</h2>
      <Field id="checkout-name" label="Naam" error={errors.name}>
        <input id="checkout-name" value={name} onChange={event => setName(event.target.value)} {...errorProps('checkout-name', errors.name)} />
      </Field>
      <Field id="checkout-time" label="Tijdstip" error={errors.time}>
        <input id="checkout-time" type="time" value={time} onChange={event => setTime(event.target.value)} {...errorProps('checkout-time', errors.time)} />
      </Field>
      <fieldset className="choice">
        <legend>Afhalen of levering</legend>
        <label><input type="radio" name="method" checked={method === 'afhalen'} onChange={() => setMethod('afhalen')} /> Afhalen</label>
        <label><input type="radio" name="method" checked={method === 'levering'} onChange={() => setMethod('levering')} /> Levering</label>
      </fieldset>
      {method === 'levering' && (
        <Field id="checkout-address" label="Adres" error={errors.address}>
          <input id="checkout-address" value={address} onChange={event => setAddress(event.target.value)} {...errorProps('checkout-address', errors.address)} />
        </Field>
      )}
      {mutation.isError && <p className="state state--error" role="alert">{mutation.error.message}</p>}
      <button type="submit" className="button button--primary" disabled={mutation.isPending}>
        {mutation.isPending ? 'Bezig…' : 'Bestellen'}
      </button>
    </form>
  )
}
