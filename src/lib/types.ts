// src/lib/types.ts

export interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  main_image_url: string;
  price_period?: string;
}