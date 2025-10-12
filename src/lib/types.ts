// src/lib/types.ts

export interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  main_image_url: string;
  price_period?: string;
  created_at: string; // <-- เพิ่มบรรทัดนี้เข้ามา
}