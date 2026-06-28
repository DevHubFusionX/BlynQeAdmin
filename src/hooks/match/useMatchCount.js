import { useQuery } from '@tanstack/react-query'
import { getMatchCount } from '../../api/match/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Fetch matches metrics summary (superLike, like, dislike, total)
 * @param {{ days?: string }} params
 */
export function useMatchCount(params) {
  return useQuery({
    queryKey: QUERY_KEYS.match.count(params),
    queryFn:  () => getMatchCount(params),
    staleTime: 1000 * 30, // 30 seconds
  })
}
