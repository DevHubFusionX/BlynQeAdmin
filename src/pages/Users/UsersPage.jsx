import { useState } from 'react'
import { useUsers } from '../../hooks/users/useUsers.js'
import { useSuspendedUsers } from '../../hooks/users/useSuspendedUsers.js'
import { useSuspendUser } from '../../hooks/users/useSuspendUser.js'
import { useUnsuspendUser } from '../../hooks/users/useUnsuspendUser.js'
import { useDeleteUser } from '../../hooks/users/useDeleteUser.js'
import { useUIStore } from '../../store/uiStore.js'

import { ConfirmModal } from './ui.jsx'
import StatsBar from './StatsBar.jsx'
import UsersTable from './UsersTable.jsx'
import UserDrawer from './UserDrawer.jsx'
import FaceVerifTab from './FaceVerifTab.jsx'
import FaceVerifDrawer from './FaceVerifDrawer.jsx'

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  // Drawer / Modal states
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedVerifId, setSelectedVerifId] = useState(null)
  const [suspendModalUser, setSuspendModalUser] = useState(null)
  const [deleteModalUser, setDeleteModalUser] = useState(null)

  // API hooks
  const { data: allUsers, isLoading: loadingAll } = useUsers({ page, limit: 10, search: searchQuery })
  const { data: suspendedUsers, isLoading: loadingSuspended } = useSuspendedUsers({ page, limit: 10, search: searchQuery })

  const suspendMutation = useSuspendUser()
  const unsuspendMutation = useUnsuspendUser()
  const deleteMutation = useDeleteUser()

  // Reset page when switching search or tab
  const handleTabChange = (val) => {
    setActiveTab(val)
    setPage(1)
  }

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setPage(1)
  }

  // Select appropriate data
  const usersData = activeTab === 'all' ? allUsers : suspendedUsers
  const isLoading = activeTab === 'all' ? loadingAll : loadingSuspended

  const showToast = useUIStore((s) => s.showToast)

  // Mutator triggers
  const handleSuspendConfirm = () => {
    if (!suspendModalUser) return
    const userId = suspendModalUser._id ?? suspendModalUser.id
    const isSuspended = suspendModalUser.status === 'suspended' || suspendModalUser.isSuspended

    const mutation = isSuspended ? unsuspendMutation : suspendMutation
    mutation.mutate(
      { userId },
      {
        onSuccess: () => {
          showToast(`Successfully ${isSuspended ? 'unsuspended' : 'suspended'} ${suspendModalUser.name ?? 'user'}!`, 'success')
          setSuspendModalUser(null)
          setSelectedUserId(null)
        },
        onError: (err) => {
          showToast(err?.message ?? `Failed to ${isSuspended ? 'unsuspend' : 'suspend'} user.`, 'error')
        },
      }
    )
  }

  const handleDeleteConfirm = () => {
    if (!deleteModalUser) return
    const userId = deleteModalUser._id ?? deleteModalUser.id
    deleteMutation.mutate(
      { userId },
      {
        onSuccess: () => {
          showToast(`Successfully deleted ${deleteModalUser.name ?? 'user'} account.`, 'success')
          setDeleteModalUser(null)
          setSelectedUserId(null)
        },
        onError: (err) => {
          showToast(err?.message ?? 'Failed to delete user.', 'error')
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <StatsBar />

      {/* Main Table / Tab Content */}
      <div className="space-y-4">
        <UsersTable
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          usersData={usersData}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          onViewDetails={setSelectedUserId}
          onSuspendToggle={setSuspendModalUser}
          onDelete={setDeleteModalUser}
        />

        {activeTab === 'face-id' && (
          <FaceVerifTab onViewDetails={setSelectedVerifId} />
        )}
      </div>

      {/* User details inspector drawer */}
      <UserDrawer
        open={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId}
        onSuspendToggle={setSuspendModalUser}
        onDelete={setDeleteModalUser}
      />

      {/* Face verification review drawer */}
      <FaceVerifDrawer
        open={!!selectedVerifId}
        onClose={() => setSelectedVerifId(null)}
        verificationId={selectedVerifId}
      />

      {/* Suspend / Unsuspend Confirm Modal */}
      {suspendModalUser && (
        <ConfirmModal
          open={!!suspendModalUser}
          onClose={() => setSuspendModalUser(null)}
          onConfirm={handleSuspendConfirm}
          isPending={suspendMutation.isPending || unsuspendMutation.isPending}
          title={
            suspendModalUser.status === 'suspended' || suspendModalUser.isSuspended
              ? 'Unsuspend User Account?'
              : 'Suspend User Account?'
          }
          description={`Are you sure you want to ${
            suspendModalUser.status === 'suspended' || suspendModalUser.isSuspended
              ? 'unsuspend'
              : 'suspend'
          } ${suspendModalUser.name ?? 'this user'}? This will change their access status on the platform.`}
          confirmLabel={
            suspendModalUser.status === 'suspended' || suspendModalUser.isSuspended
              ? 'Unsuspend'
              : 'Suspend'
          }
          danger={!(suspendModalUser.status === 'suspended' || suspendModalUser.isSuspended)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteModalUser && (
        <ConfirmModal
          open={!!deleteModalUser}
          onClose={() => setDeleteModalUser(null)}
          onConfirm={handleDeleteConfirm}
          isPending={deleteMutation.isPending}
          title="Delete User Account?"
          description={`Are you sure you want to permanently delete the account for ${
            deleteModalUser.name ?? 'this user'
          }? This action is irreversible and deletes all matched data.`}
          confirmLabel="Delete permanently"
          danger={true}
        />
      )}
    </div>
  )
}
