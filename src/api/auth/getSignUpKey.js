import { api } from '../client.js'

/**
 * GET /admins/auth/key/:id
 * Fetch the sign-up key for a specific admin ID.
 */
export const getSignUpKey = (id) => api.get(`/admins/auth/key/${id}`)
