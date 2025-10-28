import Link from 'next/link';
import styles from './CategoryIcons.module.css';
// ⭐️ หมายเหตุ: คุณจะต้องหาไฟล์ SVG Icon มาใส่เองนะครับ
// ผมจะใช้ตัวอักษรแทนไอคอนไปก่อน
// แนะนำ: ไปหา icon สวยๆ จากเว็บอย่าง flaticon.com หรือ svgrepo.com

// 1. กำหนดหมวดหมู่ที่เราต้องการโชว์
const categories = [
  { name: 'Villa', href: '/properties?status=For+Sale&type=Villa', icon: '🏡' },
  { name: 'Condo', href: '/properties?status=For+Sale&type=Condo', icon: '🏢' },
  { name: 'House', href: '/properties?status=For+Sale&type=House', icon: '🏠' },
  { name: 'Apartment', href: '/properties?status=For+Rent&type=Apartment', icon: '🏬' },
  { name: 'Land', href: '/properties?status=For+Sale&type=Land', icon: '🌳' },
  // คุณสามารถเพิ่ม/แก้ไขหมวดหมู่และ link ได้ตามต้องการ
];

export default function CategoryIcons() {
  return (
    <section className={styles.categoryContainer}>
      <div className={styles.categoryGrid}>
        {categories.map((category) => (
          <Link href={category.href} key={category.name} className={styles.categoryCard}>
            <div className={styles.iconWrapper}>
              {/* ⭐️ แทนที่ <span> นี้ด้วย <Image> หรือ SVG Icon จริงๆ 
                เช่น <Image src="/icons/villa.svg" width={40} height={40} alt={category.name} />
              */}
              <span className={styles.iconPlaceholder}>{category.icon}</span>
            </div>
            <span className={styles.categoryName}>{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}