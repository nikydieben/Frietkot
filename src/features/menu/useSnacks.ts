import { useQuery } from '@tanstack/react-query'
import { getSnacks } from '../../shared/api/snacks'

/** Server state via TanStack Query: caching, deduplicatie en één status-veld. */
export function useSnacks() {
  return useQuery({ queryKey: ['snacks'], queryFn: getSnacks })
}
