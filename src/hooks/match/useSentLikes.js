import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getSentLikes } from '../../api/match/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Fetch paginated list of likes sent by the current user.
 * @param {{ page: string, limit: string }} params
 */
export function useSentLikes(params) {
  return useQuery({
    queryKey: QUERY_KEYS.match.sent(params),
    queryFn:  () => getSentLikes(params),
    placeholderData: keepPreviousData,
  })
}
