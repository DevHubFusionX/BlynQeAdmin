import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getMatchHistory } from '../../api/match/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Fetch user match history with pagination.
 * @param {{ page: string, limit: string }} params
 */
export function useMatchHistory(params) {
  return useQuery({
    queryKey: QUERY_KEYS.match.history(params),
    queryFn:  () => getMatchHistory(params),
    placeholderData: keepPreviousData,
  })
}
