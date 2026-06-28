import { api } from '../client.js'

/**
 * DELETE /admins/users/
 * Body: { userId: string }
 */
export const deleteUser = (body) => api.delete('/admins/users/', body)
