import './admin-style.css'; // Import CSS สำหรับ Admin
import Sidebar from './Sidebar'; // Import Sidebar component

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-wrapper">
      <Sidebar />
      {children} {/* 'children' คือเนื้อหาของ page.tsx ที่จะถูกนำมาแสดงตรงนี้ */}
    </div>
  );
}