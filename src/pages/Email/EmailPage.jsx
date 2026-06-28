import { useState } from 'react'
import { useMassSend } from '../../hooks/email/useMassSend.js'
import { useSendEmail } from '../../hooks/email/useSendEmail.js'
import { useUIStore } from '../../store/uiStore.js'
import { C } from '../Users/ui.jsx'
import { Mail, Eye, Send, AlertTriangle, Sparkles, UserCheck, Layers } from 'lucide-react'

export default function EmailPage() {
  const massMutation = useMassSend()
  const supportMutation = useSendEmail()
  const showToast = useUIStore((s) => s.showToast)

  const [activeTab, setActiveTab] = useState('mass') // 'mass' | 'support'
  const [showPreview, setShowPreview] = useState(true)

  // ─── Mass Broadcast States ───
  const [massSubject, setMassSubject] = useState('')
  const [massHtml, setMassHtml] = useState('')
  const [massConfirmed, setMassConfirmed] = useState(false)

  // ─── Support Email States ───
  const [supportToa, setSupportToa] = useState('')
  const [supportTo, setSupportTo] = useState('Support@boomger.com')
  const [supportSubject, setSupportSubject] = useState('')
  const [supportHtml, setSupportHtml] = useState('')

  // ─── Submit Handlers ───
  const handleMassSubmit = (e) => {
    e.preventDefault()
    if (!massConfirmed) {
      showToast('Please confirm the warning before sending.', 'error')
      return
    }
    if (!massSubject.trim() || !massHtml.trim()) {
      showToast('Subject and HTML content are required.', 'error')
      return
    }

    massMutation.mutate(
      {
        subject: massSubject.trim(),
        html: massHtml,
      },
      {
        onSuccess: () => {
          showToast('Mass email broadcast successfully queued!', 'success')
          setMassSubject('')
          setMassHtml('')
          setMassConfirmed(false)
        },
        onError: (err) => {
          showToast(err?.message ?? 'Failed to send mass email.', 'error')
        },
      }
    )
  }

  const handleSupportSubmit = (e) => {
    e.preventDefault()
    if (!supportToa.trim() || !supportTo.trim() || !supportSubject.trim() || !supportHtml.trim()) {
      showToast('All fields are required for targeted support emails.', 'error')
      return
    }

    supportMutation.mutate(
      {
        toa: supportToa.trim(),
        to: supportTo.trim(),
        subject: supportSubject.trim(),
        html: supportHtml,
      },
      {
        onSuccess: () => {
          showToast('Support email dispatched successfully!', 'success')
          setSupportToa('')
          setSupportSubject('')
          setSupportHtml('')
        },
        onError: (err) => {
          showToast(err?.message ?? 'Failed to dispatch support email.', 'error')
        },
      }
    )
  }

  // ─── Templates Loaders ───
  const loadMassTemplate = () => {
    const template = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f1115; color: #f4f4f5; padding: 32px 16px; margin: 0; }
    .card { background-color: #16181d; border: 1px solid #23252e; border-radius: 16px; padding: 32px; max-width: 540px; margin: 0 auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .logo { color: #f97316; font-size: 24px; font-weight: 900; margin-bottom: 24px; letter-spacing: -0.025em; text-align: center; }
    .badge { display: inline-block; background-color: rgba(249,115,22,0.1); color: #f97316; font-size: 10px; font-weight: bold; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.05em; margin-bottom: 16px; }
    h2 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 12px; }
    p { font-size: 13px; line-height: 1.6; color: #a1a1aa; margin-top: 0; margin-bottom: 16px; }
    .button-container { text-align: center; margin: 24px 0; }
    .button { display: inline-block; background-color: #f97316; color: #ffffff !important; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; box-shadow: 0 4px 12px rgba(249,115,22,0.2); }
    .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #23252e; font-size: 11px; color: #52525b; text-align: center; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Blynque</div>
    <div style="text-align: center;">
      <span class="badge">Important Notice</span>
    </div>
    <h2>Security System Operations Update</h2>
    <p>Dear Blynque User,</p>
    <p>As part of our commitment to maintaining a secure and reliable experience, our administrators have completed a security audit and dashboard redesign.</p>
    <p>We've implemented additional audit logging and face verification features to better safeguard your personal identity and matches database logs.</p>
    <div class="button-container">
      <a href="#" class="button">Access Platform</a>
    </div>
    <p>If you have any questions or notice unusual activity, please contact support immediately.</p>
    <div class="footer">
      You are receiving this system communication because you have a registered account on the Blynque platform.<br>
      © 2026 Blynque. All rights reserved.
    </div>
  </div>
</body>
</html>`
    setMassHtml(template)
    setMassSubject('Blynque Security & Platform Operations Update')
    showToast('Loaded starter broadcast template!', 'success')
  }

  const loadSupportTemplate = () => {
    const template = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b; padding: 24px; margin: 0; }
    .card { background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 32px; max-width: 540px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .logo { color: #f97316; font-size: 22px; font-weight: 800; margin-bottom: 20px; }
    .ticket-id { font-size: 11px; font-weight: bold; color: #71717a; text-transform: uppercase; margin-bottom: 12px; }
    h2 { font-size: 18px; font-weight: 700; color: #09090b; margin-top: 0; margin-bottom: 12px; }
    p { font-size: 13px; line-height: 1.5; color: #3f3f46; margin-top: 0; margin-bottom: 16px; }
    .highlight-box { background-color: #fafafa; border-left: 4px solid #f97316; padding: 16px; margin: 20px 0; border-radius: 4px; font-size: 13px; font-style: italic; }
    .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #f4f4f5; font-size: 11px; color: #71717a; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Blynque Support</div>
    <div class="ticket-id">Case Ref: #BLQ-9821-X</div>
    <h2>Response to Support Inquiry</h2>
    <p>Hello,</p>
    <p>Thank you for contacting Blynque Support. We are writing to update you on your inquiry regarding account validation logs.</p>
    <div class="highlight-box">
      "Our operations team has completed the investigation and resolved the verification sync error on your profile. You should now be able to verify your identity and access matches page."
    </div>
    <p>If there's anything else we can assist you with, please feel free to reply directly to this thread.</p>
    <p>Best regards,<br>Blynque Support Team</p>
    <div class="footer">
      This is a support communication sent from Blynque Admin Console.<br>
      © 2026 Blynque. All rights reserved.
    </div>
  </div>
</body>
</html>`
    setSupportHtml(template)
    setSupportSubject('Blynque Support - Case #BLQ-9821-X Resolved')
    showToast('Loaded support response template!', 'success')
  }

  // Active inputs depending on selected tab
  const previewHtml = activeTab === 'mass' ? massHtml : supportHtml
  const isPending = massMutation.isPending || supportMutation.isPending

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Communications</h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Send bulk system-wide announcements or respond to individual support issues.
          </p>
        </div>
        <button
          onClick={activeTab === 'mass' ? loadMassTemplate : loadSupportTemplate}
          className="px-4 py-2 border hover:bg-white/5 text-gray-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          style={{ borderColor: C.border }}
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          {activeTab === 'mass' ? 'Load Starter Broadcast' : 'Load Support Template'}
        </button>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b" style={{ borderColor: C.border }}>
        <button
          onClick={() => setActiveTab('mass')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'mass'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
          disabled={isPending}
        >
          <Layers className="w-3.5 h-3.5" />
          Mass Broadcast
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'support'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
          disabled={isPending}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Targeted Support Email
        </button>
      </div>

      {/* Main Grid: Composer vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Form Composer */}
        <div className="space-y-5">
          {activeTab === 'mass' ? (
            /* ──── MASS BROADCAST COMPOSER ──── */
            <form onSubmit={handleMassSubmit} className="space-y-5">
              {/* Warning Alert */}
              <div
                className="p-4 rounded-2xl border flex items-start gap-3.5 text-xs text-amber-400"
                style={{ backgroundColor: '#f59e0b0b', borderColor: '#f59e0b1c' }}
              >
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-white block">Platform-Wide Action Warning</span>
                  <p className="leading-relaxed" style={{ color: C.muted }}>
                    Submitting this broadcast will send an email directly to all registered platform users. This operation is asynchronous, permanent, and cannot be undone once dispatched. Please ensure subject, markup structure, and link URLs are correct.
                  </p>
                </div>
              </div>

              {/* Form Fields Card */}
              <div
                className="p-6 rounded-2xl border space-y-4"
                style={{ backgroundColor: C.card, borderColor: C.border }}
              >
                {/* Subject Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Email Subject Line
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={massSubject}
                      onChange={(e) => setMassSubject(e.target.value)}
                      placeholder="Enter a compelling subject line..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors"
                      style={{ borderColor: C.border }}
                      disabled={isPending}
                    />
                    <Mail className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* HTML Body Editor */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Email Body (HTML Format)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {showPreview ? 'Hide Live Preview' : 'Show Live Preview'}
                    </button>
                  </div>
                  <textarea
                    required
                    value={massHtml}
                    onChange={(e) => setMassHtml(e.target.value)}
                    placeholder="<html><body><h1>Announcement</h1><p>Insert your content...</p></body></html>"
                    className="w-full h-72 px-3.5 py-3 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors font-mono resize-y leading-relaxed"
                    style={{ borderColor: C.border }}
                    disabled={isPending}
                  />
                </div>

                {/* Confirmation checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    checked={massConfirmed}
                    onChange={(e) => setMassConfirmed(e.target.checked)}
                    className="accent-orange-500 rounded mt-0.5 cursor-pointer"
                    disabled={isPending}
                  />
                  <span className="text-[11px] text-gray-400 leading-snug">
                    I have reviewed the email markup and confirm that I want to send this broadcast to all users.
                  </span>
                </label>
              </div>

              {/* Action Footer */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending || !massConfirmed || !massSubject.trim() || !massHtml.trim()}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:hover:bg-orange-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  {massMutation.isPending ? 'Sending Broadcast...' : 'Send Broadcast Email'}
                </button>
              </div>
            </form>
          ) : (
            /* ──── TARGETED SUPPORT COMPOSER ──── */
            <form onSubmit={handleSupportSubmit} className="space-y-5">
              {/* Form Fields Card */}
              <div
                className="p-6 rounded-2xl border space-y-4"
                style={{ backgroundColor: C.card, borderColor: C.border }}
              >
                {/* Support Email Config Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* From Address */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      From (Support Address)
                    </label>
                    <input
                      type="email"
                      required
                      value={supportTo}
                      onChange={(e) => setSupportTo(e.target.value)}
                      placeholder="Support@boomger.com"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors"
                      style={{ borderColor: C.border }}
                      disabled={isPending}
                    />
                  </div>

                  {/* To Address */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      To (Recipient Email)
                    </label>
                    <input
                      type="email"
                      required
                      value={supportToa}
                      onChange={(e) => setSupportToa(e.target.value)}
                      placeholder="williamonyejiaka2021@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors"
                      style={{ borderColor: C.border }}
                      disabled={isPending}
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Email Subject Line
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="Enter the response subject..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors"
                      style={{ borderColor: C.border }}
                      disabled={isPending}
                    />
                    <Mail className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* HTML Body Editor */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Email Body (HTML Format)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {showPreview ? 'Hide Live Preview' : 'Show Live Preview'}
                    </button>
                  </div>
                  <textarea
                    required
                    value={supportHtml}
                    onChange={(e) => setSupportHtml(e.target.value)}
                    placeholder="<html><body><h1>Hi Support</h1><p>We solved your issue...</p></body></html>"
                    className="w-full h-72 px-3.5 py-3 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors font-mono resize-y leading-relaxed"
                    style={{ borderColor: C.border }}
                    disabled={isPending}
                  />
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending || !supportToa.trim() || !supportTo.trim() || !supportSubject.trim() || !supportHtml.trim()}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:hover:bg-orange-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  {supportMutation.isPending ? 'Dispatching Support Email...' : 'Send Support Email'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Live Render Preview */}
        {showPreview && (
          <div className="space-y-4 lg:sticky lg:top-4">
            <div className="flex items-center gap-2 px-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Live Broadcast Preview
              </span>
            </div>

            <div
              className="w-full h-[520px] rounded-2xl border overflow-hidden bg-white shadow-2xl relative"
              style={{ borderColor: C.border }}
            >
              {previewHtml.trim() ? (
                <iframe
                  title="Email Preview"
                  srcDoc={previewHtml}
                  className="w-full h-full border-none"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-zinc-950/80 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border flex items-center justify-center mb-3.5" style={{ borderColor: C.border }}>
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-sm font-bold text-white">No Content Yet</span>
                  <p className="text-xs max-w-xs mt-1" style={{ color: C.muted }}>
                    Your custom HTML template will be rendered in real-time inside this viewport once you start writing or load a starter template.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
