import { api } from '../client.js'

/**
 * GET /admins/users
 * @param {object} params - Optional pagination/filter query params
 */
export const getUsers = (params) => api.get('/admins/users', { params })
