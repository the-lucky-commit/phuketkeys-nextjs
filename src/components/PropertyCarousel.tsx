'use client'; // ⭐️ นี่คือ Client Component

import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';

// 1. Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// 2. Import CSS ของ Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// 3. Import CSS Module ของเราเอง (เดี๋ยวสร้างในขั้นต่อไป)
import styles from './PropertyCarousel.module.css';

export default function PropertyCarousel({ properties }: { properties: Property[] }) {
  return (
    <Swiper
      // 4. Import Modules
      modules={[Navigation, Pagination]}
      className={styles.swiperContainer} // ⭐️ ใช้ CSS ของเรา
      
      // --- การตั้งค่าที่แนะนำ ---
      spaceBetween={30} // ⭐️ ระยะห่าง 30px (เหมือน gap เดิมของคุณ)
      navigation // ⭐️ เปิดใช้งานปุ่ม ลูกศร ซ้าย/ขวา
      pagination={{ clickable: true }} // ⭐️ เปิดใช้งานปุ่ม ... ข้างล่าง
      loop={true} // ⭐️ ทำให้วนลูปได้

      // 5. Responsive (สำคัญมาก)
      //    นี่คือการบอกว่าให้โชว์กี่สไลด์ที่ขนาดหน้าจอต่างๆ
      //    (เลียนแบบ media query เดิมของคุณ)
      breakpoints={{
        // เมื่อจอกว้าง 0px ขึ้นไป (มือถือ)
        0: {
          slidesPerView: 1,
        },
        // เมื่อจอกว้าง 768px ขึ้นไป (Tablet)
        768: {
          slidesPerView: 2,
        },
        // เมื่อจอกว้าง 992px ขึ้นไป (Desktop)
        992: {
          slidesPerView: 3,
        },
      }}
    >
      {properties.map(prop => (
        // 6. หุ้ม PropertyCard ด้วย SwiperSlide
        <SwiperSlide key={prop.id} className={styles.swiperSlide}>
          <PropertyCard property={prop} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}