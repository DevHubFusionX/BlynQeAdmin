import { useMutation } from '@tanstack/react-query'
import { login } from '../../api/auth/index.js'
import { useAuthStore } from '../../store/authStore.js'

/**
 * Signs in the admin. On success, persists token + admin profile to the auth store.
 */
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // API returns: { admin: {...}, token: string }
      setAuth({ token: data.token, user: data.admin })
    },
  })
}
