import AdminAuthProvider from '@/components/AdminAuthProvider'; // ใช้ @/components/... ได้เลย
import './admin-style.css';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider> {/* <-- ครอบตรงนี้ */}
      <div className="admin-wrapper">
        <Sidebar />
        {children}
      </div>
    </AdminAuthProvider>
  );
}