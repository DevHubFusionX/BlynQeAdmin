import { api } from '../client.js'

/**
 * PATCH /admins/users/suspend
 * Body: { userId: string }
 */
export const suspendUser = (body) => api.patch('/admins/users/suspend', body)
