import { useQuery } from '@tanstack/react-query'
import { getUsersCount } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Returns counts of active, suspended, and reported users.
 * Refetches every 30 seconds to stay reasonably updated without excessive load.
 */
export function useUsersCount() {
  return useQuery({
    queryKey: QUERY_KEYS.users.count(),
    queryFn:  getUsersCount,
    staleTime: 1000 * 30,
  })
}
