import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getUsers } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Paginated list of platform users.
 * Optimized with keepPreviousData to prevent page-change layout flickers.
 * @param {object} params - Optional query/pagination params
 */
export function useUsers(params) {
  return useQuery({
    queryKey: QUERY_KEYS.users.list(params),
    queryFn:  () => getUsers(params),
    placeholderData: keepPreviousData,
  })
}
