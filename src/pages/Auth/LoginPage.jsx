import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Shield, Zap, Globe } from 'lucide-react'
import { useLogin } from '../../hooks/auth'
import { useAuthStore } from '../../store/authStore.js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { mutate: loginMutation, isPending } = useLogin()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    loginMutation(
      { email, password },
      {
        onError: (err) => {
          setErrorMessage(err.message ?? 'Invalid email or password.')
        },
      }
    )
  }

  return (
    <div className="min-h-screen w-full flex font-sans" style={{ backgroundColor: '#0a0b0f' }}>
      {/* Left side: Login Form */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 shrink-0">
        {/* Top brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-orange-500/25">
            B
          </div>
          <span className="font-bold tracking-wide text-white text-base">
            Blynque
          </span>
        </div>

        {/* Center Card */}
        <div className="max-w-sm w-full mx-auto">
          <div className="space-y-2 mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Sign in to access the admin console and manage your platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div
                className="p-3.5 rounded-xl text-xs flex items-center gap-2.5 border"
                style={{ backgroundColor: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}
              >
                <span className="shrink-0">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6b7280' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4b5563' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@blynque.com"
                  disabled={isPending}
                  className="w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                  style={{ backgroundColor: '#14161c', borderColor: '#23252e' }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6b7280' }}>
                  Password
                </label>
                <a href="#forgot" className="text-[10px] font-bold text-orange-500 hover:text-orange-400 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4b5563' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isPending}
                  className="w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                  style={{ backgroundColor: '#14161c', borderColor: '#23252e' }}
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-700 accent-orange-500 cursor-pointer" />
              <span className="text-xs" style={{ color: '#6b7280' }}>Remember for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Access Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-[11px] flex items-center justify-between" style={{ color: '#374151' }}>
          <span>&copy; 2026 Blynque Inc.</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Security Gated</span>
        </div>
      </div>

      {/* Right side: Pure CSS decorative hero panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden m-4 ml-0 rounded-3xl" style={{ backgroundColor: '#111318' }}>
        {/* Gradient orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-2xl" style={{ background: 'radial-gradient(circle, #fdba74 0%, transparent 70%)' }} />

        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          {/* Animated floating badge */}
          <div
            className="mb-8 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
            style={{ borderColor: 'rgba(249,115,22,0.2)', color: '#f97316', backgroundColor: 'rgba(249,115,22,0.06)' }}
          >
            Admin Console v1.0
          </div>

          {/* Central icon cluster */}
          <div className="relative w-40 h-40 mb-10">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 opacity-10" style={{ borderColor: '#f97316' }} />
            <div className="absolute inset-3 rounded-full border opacity-15" style={{ borderColor: '#f97316', borderStyle: 'dashed' }} />

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
                <span className="text-white font-black text-3xl">B</span>
              </div>
            </div>

            {/* Orbiting dots */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
            <div className="absolute bottom-3 right-1 w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2.5 h-2.5 rounded-full bg-orange-400 shadow-lg shadow-orange-400/50" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Blynque Platform
          </h2>
          <p className="text-sm max-w-xs leading-relaxed mb-10" style={{ color: '#6b7280' }}>
            Centralized administration for user operations, match analytics, reports monitoring, and system-wide communications.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Shield, label: 'User Management' },
              { icon: Zap, label: 'Match Analytics' },
              { icon: Globe, label: 'System Comms' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium"
                style={{ borderColor: '#23252e', color: '#9ca3af', backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <Icon className="w-3.5 h-3.5 text-orange-500" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Corner decorative elements */}
        <div className="absolute top-8 right-8 w-16 h-16 border rounded-2xl rotate-12 opacity-5" style={{ borderColor: '#f97316' }} />
        <div className="absolute bottom-8 left-8 w-12 h-12 border rounded-xl -rotate-12 opacity-5" style={{ borderColor: '#f97316' }} />
      </div>
    </div>
  )
}
