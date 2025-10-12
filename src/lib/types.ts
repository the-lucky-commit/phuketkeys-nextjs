// src/lib/types.ts

export interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  main_image_url: string;
  price_period?: string;
  created_at: string;

  // --- เพิ่ม 4 field นี้เข้ามา ---
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  description?: string;
}