// src/lib/types.ts
export interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  main_image_url: string;
  main_image_public_id?: string | null;
  created_at: string;
  price_period?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  description?: string;
  images?: { id: number; image_url: string }[];
}