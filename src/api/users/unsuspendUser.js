import { api } from '../client.js'

/**
 * PATCH /admins/users/unsuspend
 * Body: { userId: string }
 */
export const unsuspendUser = (body) => api.patch('/admins/users/unsuspend', body)
