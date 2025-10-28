// src/app/(public)/layout.tsx

import Navbar from '@/components/Navbar'; // 1. Import Navbar
import Footer from '@/components/Footer'; // 2. Import Footer

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      {/* 3. {children} คือหน้าเว็บสาธารณะ (เช่น หน้าแรก, หน้ารายละเอียด) 
             ซึ่งจะถูกนำมาแสดงผลตรงนี้ */}
      {children} 

      <Footer />
    </>
  );
}