import AdminAuthProvider from '@/components/AdminAuthProvider';
import './admin-style.css'; // Path นี้ถูกต้องแล้วหลังจากย้ายไฟล์
import Sidebar from './Sidebar';   // Path นี้ถูกต้องแล้วหลังจากย้ายไฟล์

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="admin-wrapper">
        <Sidebar />
        {children}
      </div>
    </AdminAuthProvider>
  );
}