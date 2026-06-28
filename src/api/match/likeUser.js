import { api } from '../client.js'

/**
 * POST /admins/match/like
 * Body: { likedUserId: string, action: 'like' | 'dislike' | 'super-like' }
 */
export const likeUser = (body) => api.post('/admins/match/like', body)
