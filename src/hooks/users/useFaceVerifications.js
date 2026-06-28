import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { listFaceVerifications } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Fetch lists of face verifications (e.g. status: 'pending').
 * @param {object} params
 */
export function useFaceVerifications(params) {
  return useQuery({
    queryKey: QUERY_KEYS.users.faceVerifications(params),
    queryFn:  () => listFaceVerifications(params),
    placeholderData: keepPreviousData,
  })
}
