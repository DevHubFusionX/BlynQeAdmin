import { api } from '../client.js'

/**
 * GET /admins/users/face-verification/:id
 */
export const getFaceVerification = (id) => api.get(`/admins/users/face-verification/${id}`)
