import { api } from '../client.js'

/**
 * GET /admins/match/history
 * @param {{ page: string, limit: string }} params
 */
export const getMatchHistory = (params) => api.get('/admins/match/history', { params })

