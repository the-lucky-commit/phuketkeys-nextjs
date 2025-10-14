// src/lib/types.ts
export interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  main_image_url: string;
  created_at: string;
  price_period?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  description?: string;
  // --- เพิ่มบรรทัดนี้เข้ามา ---
  images?: { id: number; image_url: string }[];
}