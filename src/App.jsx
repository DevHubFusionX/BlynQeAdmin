/**
 * src/App.jsx
 *
 * Root router — uses HashRouter (Electron-compatible).
 * Auth-gated: unauthenticated users are redirected to /login.
 */

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore.js'

import AdminLayout   from './components/layout/AdminLayout'
import LoginPage     from './pages/Auth'
import DashboardPage from './pages/Dashboard'
import AdminsPage    from './pages/Admins'
import UsersPage     from './pages/Users'
import UserDetailPage from './pages/UserDetail'
import MatchPage     from './pages/Match'
import ReportsPage   from './pages/Reports'
import ReportDetailPage from './pages/ReportDetail'
import EmailPage     from './pages/Email'

function AuthGuard({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="admins"         element={<AdminsPage />} />
          <Route path="users"          element={<UsersPage />} />
          <Route path="users/:id"      element={<UserDetailPage />} />
          <Route path="match"          element={<MatchPage />} />
          <Route path="reports"        element={<ReportsPage />} />
          <Route path="reports/:id"    element={<ReportDetailPage />} />
          <Route path="email"          element={<EmailPage />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
