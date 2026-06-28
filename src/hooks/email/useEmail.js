/**
 * src/hooks/email/useEmail.js
 *
 * TanStack Query hooks for admin email endpoints.
 *
 * Hooks:
 *   useMassSend()   — POST /admins/email/mass-send
 *   useSendEmail()  — POST /admins/email/email-support
 */

import { useMutation } from '@tanstack/react-query'
import { massSend, sendEmail } from '../../api/email/index.js'

// ─── POST /admins/email/mass-send ─────────────────────────────────────────────

/**
 * Send a bulk email to all platform users.
 *
 * Usage:
 *   const { mutate: send, isPending } = useMassSend()
 *   send({ subject: 'Hello', html: '<p>Hi everyone</p>' })
 */
export function useMassSend() {
  return useMutation({ mutationFn: massSend })
}

// ─── POST /admins/email/email-support ────────────────────────────────────────

/**
 * Send a targeted support email to a specific address.
 *
 * Usage:
 *   const { mutate: send } = useSendEmail()
 *   send({ subject, html, toa: 'reply@example.com', to: 'user@example.com' })
 */
export function useSendEmail() {
  return useMutation({ mutationFn: sendEmail })
}
