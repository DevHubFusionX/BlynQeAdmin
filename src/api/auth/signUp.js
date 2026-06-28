import { api } from '../client.js'

/**
 * POST /admins/auth/sign-up
 * Body: { key: string, name: string, email: string, password: string }
 */
export const signUp = (body) => api.post('/admins/auth/sign-up', body)
