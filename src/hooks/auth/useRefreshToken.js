import { useQuery } from '@tanstack/react-query'
import { refresh } from '../../api/auth/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'
import { useAuthStore } from '../../store/authStore.js'

/**
 * Silently refreshes the access token every 14 minutes.
 * Auto-runs while the stored token exists.
 */
export function useRefreshToken() {
  const { token, setAuth, user } = useAuthStore()

  return useQuery({
    queryKey: QUERY_KEYS.auth.refresh(),
    queryFn: async () => {
      const data = await refresh()
      if (data?.token) {
        setAuth({ token: data.token, user: data.user ?? user })
      }
      return data
    },
    enabled: !!token,
    staleTime:                   1000 * 60 * 14,
    refetchInterval:             1000 * 60 * 14,
    refetchIntervalInBackground: true,
  })
}
