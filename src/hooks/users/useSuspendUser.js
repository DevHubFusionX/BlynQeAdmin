import { useMutation, useQueryClient } from '@tanstack/react-query'
import { suspendUser } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Suspend a user. Invalidates related user caches on success.
 */
export function useSuspendUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: suspendUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all })
    },
  })
}
