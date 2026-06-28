import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rejectFaceVerification } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Reject a user's face verification. Invalidates related user queries.
 */
export function useRejectFaceVerification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: rejectFaceVerification,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all })
    },
  })
}
