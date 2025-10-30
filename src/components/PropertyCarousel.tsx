'use client';

import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import our CSS Module
import styles from './PropertyCarousel.module.css';

export default function PropertyCarousel({ properties }: { properties: Property[] }) {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        className={styles.swiperContainer}
        
        spaceBetween={30}
        navigation
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        loop={properties.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {properties.map((property) => (
          <SwiperSlide key={property.id} className={styles.swiperSlide}>
            <PropertyCard property={property} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}