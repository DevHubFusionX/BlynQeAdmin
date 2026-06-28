import { api } from '../client.js'

/**
 * GET /admins/match/count
 * @param {{ days?: string }} params
 */
export const getMatchCount = (params) => api.get('/admins/match/count', { params })
