import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * authStore — persisted to localStorage.
 * Holds the session token and basic user identity.
 * Server data (profile details) lives in TanStack Query cache.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,          // { id, email, displayName }
      isAuthenticated: false,

      setAuth: ({ token, user }) =>
        set({ token, user, isAuthenticated: true }),

      clearAuth: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'blynque-auth',   // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
