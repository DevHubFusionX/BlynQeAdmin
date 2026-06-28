import { useMutation } from '@tanstack/react-query'
import { massSend } from '../../api/email/index.js'

/**
 * Send a bulk email to all platform users.
 */
export function useMassSend() {
  return useMutation({ mutationFn: massSend })
}
