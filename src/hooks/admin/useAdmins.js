import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getAdmins } from '../../api/admin/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Fetch list of admins.
 * @param {object} params
 */
export function useAdmins(params) {
  return useQuery({
    queryKey: QUERY_KEYS.admins.list(params),
    queryFn:  () => getAdmins(params),
    placeholderData: keepPreviousData,
  })
}
