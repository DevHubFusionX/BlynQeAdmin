import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Header from '../Header'
import ToastContainer from '../../ui/ToastContainer.jsx'

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-100 font-sans" style={{ backgroundColor: '#13151a' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#13151a' }}>
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
