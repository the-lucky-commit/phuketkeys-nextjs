import AdminAuthProvider from '@/components/AdminAuthProvider';
import './admin-style.css';
import Sidebar from './Sidebar';

// เราสามารถตั้ง Metadata แยกสำหรับส่วน Admin ได้ด้วย
export const metadata = {
    title: "Phuket Keys Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="admin-wrapper">
        <Sidebar />
        {children} {/* นี่คือที่ที่หน้าแอดมินต่างๆ (เช่น properties/page.tsx) จะถูกนำมาแสดง */}
      </div>
    </AdminAuthProvider>
  );
}