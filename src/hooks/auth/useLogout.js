import { useMutation } from '@tanstack/react-query'
import { logout } from '../../api/auth/index.js'
import { queryClient } from '../../lib/queryClient.js'
import { useAuthStore } from '../../store/authStore.js'
import { useUIStore } from '../../store/uiStore.js'

/**
 * Logs out the current admin. Clears Zustand auth state and purges the query cache.
 */

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return useMutation({
    mutationFn: async () => {
      // 1. Synchronously clear local state to instantly redirect UI to login screen
      clearAuth()
      queryClient.clear()
      useUIStore.getState().showToast('Logged out successfully', 'success')

      // 2. Perform API request in background, racing with an 800ms timeout
      try {
        await Promise.race([
          logout(),
          new Promise((resolve) => setTimeout(resolve, 800))
        ])
      } catch (err) {
        console.warn('Background logout API failed or timed out:', err)
      }
    }
  })
}
