import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unsuspendUser } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Unsuspend a user. Invalidates related user caches on success.
 */
export function useUnsuspendUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: unsuspendUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all })
    },
  })
}
