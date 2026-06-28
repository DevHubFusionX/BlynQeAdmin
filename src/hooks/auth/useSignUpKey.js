import { useQuery } from '@tanstack/react-query'
import { getSignUpKey } from '../../api/auth/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Fetch the sign-up invitation key for an admin ID.
 * @param {string} id
 */
export function useSignUpKey(id) {
  return useQuery({
    queryKey: QUERY_KEYS.auth.signUpKey(id),
    queryFn:  () => getSignUpKey(id),
    enabled:  !!id,
  })
}
