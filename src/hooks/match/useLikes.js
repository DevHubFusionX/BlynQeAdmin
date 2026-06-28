import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getLikes } from '../../api/match/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Fetch paginated list of users who liked the specified user.
 * @param {{ page: string, limit: string }} params
 */
export function useLikes(params) {
  return useQuery({
    queryKey: QUERY_KEYS.match.likes(params),
    queryFn:  () => getLikes(params),
    placeholderData: keepPreviousData,
  })
}
