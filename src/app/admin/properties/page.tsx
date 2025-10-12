import React from 'react';
import PropertiesTable from './PropertiesTable'; // 1. Import Component
import Link from 'next/link';

// 2. ไม่ต้องใช้ async และไม่ต้องมี getProperties() อีกต่อไป
export default function ManagePropertiesPage() {
  return (
    <main className="main-content">
      <header className="main-header with-button">
        <h1>Manage Properties</h1>
        <Link href="/admin/add-property" className="btn-primary">
          <i className="fas fa-plus"></i> Add New Property
        </Link>
      </header>

      <section className="content-area">
        {/* 3. เรียกใช้ Component โดยไม่ต้องส่ง props */}
        <PropertiesTable />
      </section>
    </main>
  );
}