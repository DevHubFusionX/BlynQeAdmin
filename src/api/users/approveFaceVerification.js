import { api } from '../client.js'

/**
 * PUT /admins/users/face-verification/approve
 * Body: { id: string }
 */
export const approveFaceVerification = (body) => api.put('/admins/users/face-verification/approve', body)
