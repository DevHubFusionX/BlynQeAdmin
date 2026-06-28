import { useState } from 'react'
import { useCreateAdmin } from '../../hooks/admin/index.js'
import { Drawer, C } from '../Users/ui.jsx'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

import { useUIStore } from '../../store/uiStore.js'

export default function CreateAdminDrawer({ open, onClose }) {
  const mutation = useCreateAdmin()
  const showToast = useUIStore((s) => s.showToast)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleType, setRoleType] = useState('super-admin')
  const [customRoleId, setCustomRoleId] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('All fields are required.')
      return
    }

    const finalRoleId = roleType === 'super-admin' 
      ? '6a30215aa55aafcc197488a8' 
      : customRoleId.trim()

    if (!finalRoleId) {
      setErrorMsg('Role ID is required.')
      return
    }

    mutation.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        roleId: finalRoleId,
      },
      {
        onSuccess: () => {
          showToast('Administrator account successfully created!', 'success')
          onClose()
        },
        onError: (err) => {
          const errMsg = err?.message ?? 'Failed to create administrator account.'
          setErrorMsg(errMsg)
          showToast(errMsg, 'error')
        },
      }
    )
  }

  return (
    <Drawer open={open} onClose={onClose} title="Add New Administrator">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        {/* Form Fields */}
        <div className="flex-1 p-6 space-y-5">
          <p className="text-xs" style={{ color: C.muted }}>
            Directly provision credentials for a new operator. They can log in immediately with the specified email and password.
          </p>

          {errorMsg && (
            <div
              className="p-3.5 rounded-xl border flex items-start gap-2.5 text-xs text-red-400"
              style={{ backgroundColor: '#ef444410', borderColor: '#ef444420' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors"
              style={{ borderColor: C.border }}
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. johndoe@company.com"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors"
              style={{ borderColor: C.border }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors"
                style={{ borderColor: C.border }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role Configuration */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              Security Role
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                <input
                  type="radio"
                  name="roleType"
                  value="super-admin"
                  checked={roleType === 'super-admin'}
                  onChange={() => setRoleType('super-admin')}
                  className="accent-orange-500"
                />
                <span>Super Admin (Default)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                <input
                  type="radio"
                  name="roleType"
                  value="custom"
                  checked={roleType === 'custom'}
                  onChange={() => setRoleType('custom')}
                  className="accent-orange-500"
                />
                <span>Custom Role ID</span>
              </label>
            </div>

            {roleType === 'custom' && (
              <input
                type="text"
                required
                value={customRoleId}
                onChange={(e) => setCustomRoleId(e.target.value)}
                placeholder="Paste role MongoDB ID"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors animate-fadeIn"
                style={{ borderColor: C.border }}
              />
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div
          className="p-6 border-t flex gap-3 shrink-0"
          style={{ borderColor: C.border, backgroundColor: C.card }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50"
            style={{ borderColor: C.border, color: C.muted }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer disabled:opacity-50"
          >
            {mutation.isPending ? 'Creating...' : 'Provision Admin'}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
