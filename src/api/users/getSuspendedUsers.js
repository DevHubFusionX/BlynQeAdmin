import { api } from '../client.js'

/**
 * GET /admins/users/suspended
 * @param {object} params - Optional pagination query params
 */
export const getSuspendedUsers = (params) => api.get('/admins/users/suspended', { params })
