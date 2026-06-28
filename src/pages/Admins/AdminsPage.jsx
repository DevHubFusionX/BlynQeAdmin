import { useState } from 'react'
import { useAdmins } from '../../hooks/admin/index.js'
import StatsBar from './StatsBar.jsx'
import AdminsTable from './AdminsTable.jsx'
import CreateAdminDrawer from './CreateAdminDrawer.jsx'
import InviteDrawer from './InviteDrawer.jsx'
import { C } from '../Users/ui.jsx'

export default function AdminsPage() {
  const { data: adminsData, isLoading } = useAdmins()
  
  const [createOpen, setCreateOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [selectedAdminId, setSelectedAdminId] = useState(null)

  const admins = Array.isArray(adminsData)
    ? adminsData
    : adminsData?.records ?? adminsData?.data ?? adminsData?.admins ?? []

  const handleOpenInvite = (adminId) => {
    setSelectedAdminId(adminId)
    setInviteOpen(true)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── Header Greeting ────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Administrator Accounts
        </h1>
        <p className="text-sm mt-1" style={{ color: C.muted }}>
          Manage security access credentials, provision console operators, and inspect invitation keys.
        </p>
      </div>

      {/* ── Stats Panel ────────────────────────────────────────────── */}
      <StatsBar admins={admins} isLoading={isLoading} />

      {/* ── Admins Table Directory ─────────────────────────────────── */}
      <AdminsTable
        admins={admins}
        isLoading={isLoading}
        onOpenCreate={() => setCreateOpen(true)}
        onOpenInvite={handleOpenInvite}
      />

      {/* ── Drawers & Modals ───────────────────────────────────────── */}
      {createOpen && (
        <CreateAdminDrawer
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      )}

      {inviteOpen && (
        <InviteDrawer
          open={inviteOpen}
          onClose={() => {
            setInviteOpen(false)
            setSelectedAdminId(null)
          }}
          adminId={selectedAdminId}
        />
      )}
    </div>
  )
}

