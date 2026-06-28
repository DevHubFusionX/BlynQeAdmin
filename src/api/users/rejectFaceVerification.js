import { api } from '../client.js'

/**
 * PUT /admins/users/face-verification/reject
 * Body: { id: string }
 */
export const rejectFaceVerification = (body) => api.put('/admins/users/face-verification/reject', body)
