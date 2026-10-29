import { useEffect, useState } from 'react'
import { getSnacks, type Snack } from '../../shared/api/snacks'

type SnacksResult =
  | { status: 'pending' }
  | { status: 'error'; error: Error }
  | { status: 'success'; snacks: Snack[] }

/**
 * Haalt de snacks op via de API-laag.
 * Voorlopig met useEffect. In het stateblok vervangen we dit door TanStack Query.
 */
export function useSnacks(): SnacksResult {
  const [result, setResult] = useState<SnacksResult>({ status: 'pending' })

  useEffect(() => {
    let ignore = false
    getSnacks().then(
      snacks => { if (!ignore) setResult({ status: 'success', snacks }) },
      (error: Error) => { if (!ignore) setResult({ status: 'error', error }) },
    )
    return () => { ignore = true }
  }, [])

  return result
}
