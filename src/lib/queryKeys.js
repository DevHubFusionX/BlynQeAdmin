/**
 * src/lib/queryKeys.js
 *
 * Centralised query key factory — admin app only.
 * Use these everywhere to ensure consistent cache targeting and invalidation.
 */
export const QUERY_KEYS = {
  // ─── Auth ───────────────────────────────────────────────────
  auth: {
    all:       ['auth'],
    refresh:   ()   => ['auth', 'refresh'],
    signUpKey: (id) => ['auth', 'signUpKey', id],
  },

  // ─── Admin accounts  /users/admins/ ─────────────────────────
  admins: {
    all:    ['admins'],
    list:   (params) => ['admins', 'list', params ?? {}],
    detail: (id)     => ['admins', 'detail', id],
  },

  // ─── Platform users  /admins/users/ ─────────────────────────
  users: {
    all:               ['users'],
    list:              (params) => ['users', 'list', params ?? {}],
    suspended:         (params) => ['users', 'suspended', params ?? {}],
    count:             ()       => ['users', 'count'],
    detail:            (id)     => ['users', 'detail', id],
    faceVerifications: (params) => ['users', 'faceVerifications', params ?? {}],
    faceVerification:  (id)     => ['users', 'faceVerification', id],
  },

  // ─── Match  /admins/match/* ──────────────────────────────────
  match: {
    all:     ['match'],
    count:   (params) => ['match', 'count', params ?? {}],
    likes:   (params) => ['match', 'likes', params ?? {}],
    history: (params) => ['match', 'history', params ?? {}],
    sent:    (params) => ['match', 'sent', params ?? {}],
  },

  // ─── Reports  /reports/ ──────────────────────────────────────
  reports: {
    all:    ['reports'],
    list:   (params) => ['reports', 'list', params ?? {}],
    detail: (id)     => ['reports', 'detail', id],
  },
}
