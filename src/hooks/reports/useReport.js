import { useQuery } from '@tanstack/react-query'
import { getReport } from '../../api/reports/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'
import { useAuthStore } from '../../store/authStore.js'

/**
 * Fetch detailed information for a single report record.
 * Cached for 2 minutes.
 * @param {string} id
 */
export function useReport(id) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: QUERY_KEYS.reports.detail(id),
    queryFn:  () => getReport(id),
    enabled:  !!id && !!token,
    staleTime: 1000 * 60 * 2,
  })
}
