import { useQuery } from '@tanstack/react-query'
import { getUser } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Full profile details of a single platform user.
 * Cached for 5 minutes of staleTime to prevent unnecessary network hits.
 * @param {string} id
 */
export function useUser(id) {
  return useQuery({
    queryKey: QUERY_KEYS.users.detail(id),
    queryFn:  () => getUser(id),
    enabled:  !!id,
    staleTime: 1000 * 60 * 5,
  })
}
