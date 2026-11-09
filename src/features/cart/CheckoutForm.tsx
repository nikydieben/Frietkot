// Haal de // weg bij wat je nodig hebt:
// import { useState, type FormEvent } from 'react'
// import { useMutation } from '@tanstack/react-query'
// import { useNavigate } from 'react-router'
// import { placeOrder } from '../../shared/api/orders'
// import { useCart } from './CartContext'

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
export function CheckoutForm() {
  return (
    <section className="checkout">
      <h2>Bestellen</h2>
      {/* STAP 1: het formulier */}
    </section>
  )
}
