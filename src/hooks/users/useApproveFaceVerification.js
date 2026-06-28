import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveFaceVerification } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Approve a user's face verification. Invalidates related user queries.
 */
export function useApproveFaceVerification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: approveFaceVerification,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all })
    },
  })
}
