import { useQuery } from '@tanstack/react-query'
import { getFaceVerification } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Fetch face verification details for a single record.
 * @param {string} id
 */
export function useFaceVerification(id) {
  return useQuery({
    queryKey: QUERY_KEYS.users.faceVerification(id),
    queryFn:  () => getFaceVerification(id),
    enabled:  !!id,
    staleTime: 1000 * 60 * 5,
  })
}
