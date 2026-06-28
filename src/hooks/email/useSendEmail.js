import { useMutation } from '@tanstack/react-query'
import { sendEmail } from '../../api/email/index.js'

/**
 * Send a targeted support email.
 */
export function useSendEmail() {
  return useMutation({ mutationFn: sendEmail })
}
