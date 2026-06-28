import { useMutation } from '@tanstack/react-query'
import { signUp } from '../../api/auth/index.js'

/**
 * Register a new admin using an invitation key.
 */
export function useSignUp() {
  return useMutation({ mutationFn: signUp })
}
