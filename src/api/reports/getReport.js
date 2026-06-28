import { api } from '../client.js'

/**
 * GET /reports/:id
 */
export const getReport = (id) => api.get(`/reports/${id}`)
