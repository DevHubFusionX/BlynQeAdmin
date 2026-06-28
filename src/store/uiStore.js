import { create } from 'zustand'

/**
 * uiStore — ephemeral UI state (not persisted).
 * Controls which admin modals are open and global notifications.
 */
export const useUIStore = create((set) => ({
  // ─── Modals ───────────────────────────────────────────────
  activeModal: null,   // string | null — modal ID
  modalData:   null,   // any data to pass into the open modal

  openModal:  (id, data = null) => set({ activeModal: id, modalData: data }),
  closeModal: ()                => set({ activeModal: null, modalData: null }),

  // ─── Toast / Notifications ────────────────────────────────
  toasts: [],   // Array of { id, message, type: 'success' | 'error' | 'info' }

  showToast: (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // ─── Global loading (e.g. full-screen spinner) ────────────
  isGlobalLoading: false,
  setGlobalLoading: (val) => set({ isGlobalLoading: val }),
}))

/** Admin modal ID constants — import these instead of raw strings */
export const MODALS = {
  CONFIRM_DELETE:   'confirm-delete',
  CONFIRM_SUSPEND:  'confirm-suspend',
  CONFIRM_PUBLISH:  'confirm-publish',
  EDIT_USER:        'edit-user',
  SEND_NOTIFY:      'send-notify',
}
