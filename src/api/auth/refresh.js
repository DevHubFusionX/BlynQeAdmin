import { api } from '../client.js'

/**
 * GET /auth/refresh
 * Silently refresh the access token.
 */
export const refresh = () => api.get('/auth/refresh')
