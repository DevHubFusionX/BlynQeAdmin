import { api } from '../client.js'

/**
 * GET /admins/users/:id
 */
export const getUser = (id) => api.get(`/admins/users/${id}`)
