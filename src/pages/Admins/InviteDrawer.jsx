import { useState } from 'react'
import { useSignUpKey } from '../../hooks/auth/index.js'
import { Drawer, C, Skeleton } from '../Users/ui.jsx'
import { Key, Copy, Check, Link, Info } from 'lucide-react'

export default function InviteDrawer({ open, onClose, adminId }) {
  const { data: keyData, isLoading, error } = useSignUpKey(adminId)

  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const key = typeof keyData === 'string' ? keyData : keyData?.key ?? keyData?.data?.key ?? ''
  
  // Construct a registration link pointing to the hash route (Electron safe)
  const signupUrl = `${window.location.origin}${window.location.pathname}#/signup?key=${key}`

  const handleCopyKey = () => {
    if (!key) return
    navigator.clipboard.writeText(key)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleCopyLink = () => {
    if (!key) return
    navigator.clipboard.writeText(signupUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <Drawer open={open} onClose={onClose} title="Invitation & Signup Credentials">
      {isLoading ? (
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2 pt-4 border-t" style={{ borderColor: C.border }}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : error || !key ? (
        <div className="p-6 space-y-4 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: '#ef444415' }}
          >
            <Info className="w-6 h-6 text-red-400" />
          </div>
          <h4 className="text-sm font-bold text-white">No Key Found</h4>
          <p className="text-xs max-w-xs mx-auto" style={{ color: C.muted }}>
            This administrator may have already registered, or the signup credentials for their account are unavailable.
          </p>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
            Provide this invitation key or direct registration link to the operator. They must use it to complete their profile setup and establish their password.
          </p>

          {/* Invitation Key */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-orange-500" /> Raw Invitation Key
            </label>
            <div
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ backgroundColor: C.surface, borderColor: C.border }}
            >
              <code className="text-xs text-orange-400 font-semibold select-all break-all flex-1">
                {key}
              </code>
              <button
                onClick={handleCopyKey}
                className="p-2 rounded-lg bg-zinc-900 border hover:bg-zinc-800 text-gray-400 hover:text-white cursor-pointer shrink-0 transition-colors"
                style={{ borderColor: C.border }}
                title="Copy Key"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Registration URL */}
          <div className="space-y-2 pt-4 border-t" style={{ borderColor: C.border }}>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-blue-400" /> Invitation Signup Link
            </label>
            <div
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ backgroundColor: C.surface, borderColor: C.border }}
            >
              <span className="text-xs text-white truncate flex-1 font-mono">
                {signupUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-zinc-900 border hover:bg-zinc-800 text-gray-400 hover:text-white cursor-pointer shrink-0 transition-colors"
                style={{ borderColor: C.border }}
                title="Copy Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Instructions Alert */}
          <div
            className="p-4 rounded-xl border flex items-start gap-3 text-xs"
            style={{ backgroundColor: '#f973160b', borderColor: '#f9731620', color: C.muted }}
          >
            <Info className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">Important Security Warning</p>
              <p className="leading-relaxed text-[11px]">
                This registration link grants administrative privileges to anyone who accesses it. Never share this code over public channels, and verify the recipient's identity before transmission.
              </p>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  )
}
