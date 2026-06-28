import { api } from '../client.js'

/**
 * POST /admins/auth/login
 * Body: { email: string, password: string }
 * Returns: { admin: { _id, name, email, roleId, status, createdAt, updatedAt }, token: string }
 */
export const login = (body) => api.post('/admins/auth/login', body)
