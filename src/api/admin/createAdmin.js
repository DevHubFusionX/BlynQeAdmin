import { api } from '../client.js'

/**
 * POST /users/admins/
 * Body: { roleId: string, name: string, email: string, password: string }
 */
export const createAdmin = (body) => api.post('/users/admins/', body)
