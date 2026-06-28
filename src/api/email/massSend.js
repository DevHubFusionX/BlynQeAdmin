import { api } from '../client.js'

/**
 * POST /admins/email/mass-send
 * Body: { subject: string, html: string }
 */
export const massSend = (body) => api.post('/admins/email/mass-send', body)
