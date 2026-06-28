import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdmin } from '../../api/admin/index.js'
import { QUERY_KEYS } from '../../lib/queryKeys.js'

/**
 * Create a new admin. Invalidates admins lists.
 */
export function useCreateAdmin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: (newAdmin) => {
      // 1. Invalidate all admin queries to trigger background refetch
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admins.all })

      // 2. Perform immediate cache update for the default list query
      const queryKey = QUERY_KEYS.admins.list() // ['admins', 'list', {}]
      qc.setQueryData(queryKey, (oldData) => {
        if (!oldData) return { records: [newAdmin] }
        if (Array.isArray(oldData)) {
          return [newAdmin, ...oldData]
        }
        if (oldData.records && Array.isArray(oldData.records)) {
          return {
            ...oldData,
            records: [newAdmin, ...oldData.records]
          }
        }
        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: [newAdmin, ...oldData.data]
          }
        }
        if (oldData.admins && Array.isArray(oldData.admins)) {
          return {
            ...oldData,
            admins: [newAdmin, ...oldData.admins]
          }
        }
        return oldData
      })
    },
  })
}
