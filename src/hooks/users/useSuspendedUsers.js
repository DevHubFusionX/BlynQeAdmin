import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getSuspendedUsers } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Paginated list of suspended platform users.
 * @param {object} params
 */
export function useSuspendedUsers(params) {
  return useQuery({
    queryKey: QUERY_KEYS.users.suspended(params),
    queryFn:  () => getSuspendedUsers(params),
    placeholderData: keepPreviousData,
  })
}
