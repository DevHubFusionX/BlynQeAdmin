import { api } from '../client.js'

/**
 * GET /admins/seeds/default-admin
 */
export const seedDefaultAdmin = () => api.get('/admins/seeds/default-admin')
