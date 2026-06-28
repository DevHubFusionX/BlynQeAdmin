import { api } from '../client.js'

/**
 * GET /auth/logout
 * Logs out the currently authenticated admin.
 */
export const logout = () => api.get('/auth/logout')
