// src/app/properties/page.tsx
import PropertyList from '@/components/PropertyList';
import styles from './properties.module.css';

// Page นี้เป็น Server Component จะได้รับ searchParams เป็น prop โดยอัตโนมัติ
export default function PropertiesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <main className={styles.mainContainer}>
      <div className="container">
        {/* เราจะส่ง searchParams ทั้งหมดต่อไปให้ Client Component จัดการ */}
        <PropertyList searchParams={searchParams} />
      </div>
    </main>
  );
}