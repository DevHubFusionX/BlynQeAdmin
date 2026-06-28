import { api } from '../client.js'

/**
 * POST /admins/email/email-support
 * Body: { subject: string, html: string, toa: string, to: string }
 */
export const sendEmail = (body) => api.post('/admins/email/email-support', body)
