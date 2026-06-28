import { api } from '../client.js'

/**
 * GET /admins/match/likes
 * @param {{ page: string, limit: string }} params
 */
export const getLikes = (params) => api.get('/admins/match/likes', { params })
