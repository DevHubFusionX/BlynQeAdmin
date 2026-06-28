import { api } from '../client.js'

/**
 * GET /reports/
 * @param {object} params - Optional status, page, limit query params
 */
export const getReports = (params) => api.get('/reports/', { params })
