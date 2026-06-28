import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getReports } from '../../api/reports/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'
import { useAuthStore } from '../../store/authStore.js'

/**
 * Paginated reports list from the queue.
 * @param {object} params - Optional page, limit, status parameters
 */
export function useReports(params) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: QUERY_KEYS.reports.list(params),
    queryFn: () => getReports(params),
    placeholderData: keepPreviousData,
    enabled: !!token,
  })
}
