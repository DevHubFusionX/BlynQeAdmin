import { api } from '../client.js'

/**
 * GET /users/admins/
 * @param {object} params - Optional query filters (pagination etc.)
 */
export const getAdmins = (params) => api.get('/users/admins/', { params })
