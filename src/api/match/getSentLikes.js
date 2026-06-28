import { api } from '../client.js'

/**
 * GET /admins/match/likes/sent
 * @param {{ page: string, limit: string }} params
 */
export const getSentLikes = (params) => api.get('/admins/match/likes/sent', { params })
