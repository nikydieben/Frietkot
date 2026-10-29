import type { Snack } from '../../shared/api/snacks'

/** Eén lijn in het mandje: een snack en hoeveel stuks. */
export type CartLine = { snack: Snack; quantity: number }
