import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likeUser } from '../../api/match/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Likes, dislikes, or superlikes a user profile. Invalidate match counts on success.
 */
export function useLikeUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: likeUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.match.all })
    },
  })
}
