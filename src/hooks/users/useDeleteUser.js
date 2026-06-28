import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '../../api/users/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Permanently deletes a user. Invalidates all user queries.
 */
export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all })
    },
  })
}
