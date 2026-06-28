import { api } from '../client.js'

/**
 * GET /admins/users/face-verification/
 * @param {{ status: string }} params
 */
export const listFaceVerifications = (params) => api.get('/admins/users/face-verification/', { params })
