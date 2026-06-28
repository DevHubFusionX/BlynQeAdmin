import { api } from '../client.js'

/**
 * GET /admins/users/count
 */
export const getUsersCount = () => api.get('/admins/users/count')
