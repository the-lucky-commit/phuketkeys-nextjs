// src/lib/types.ts

// ⬇️ [เพิ่ม 1] สร้าง Type สำหรับ Amenities
export type Amenity = {
  id: number;
  name: string;
  icon: string;
};

export type DecodedUser = {
  id: number;
  username: string;
  role: 'admin' | 'customer';
  exp?: number; // JWT expiration timestamp
};

// ⬇️ [เพิ่ม 2] สร้าง Type สำหรับ PropertyImage (เพื่อโค้ดที่สะอาดขึ้น)
// (เราจะใช้ Type นี้แทนที่ { id: number; image_url: string } ที่คุณใช้อยู่)
export type PropertyImage = {
  id: number;
  image_url: string;
};

// ⬇️ [แก้ไข 3] อัปเดต Interface 'Property'
export interface Property {
  id: number;
  title: string;
  status: string;
  type_of_sale?: string; // ⭐️ เพิ่ม: For Sale, For Rent, For Rent (Daily)
  price: number;
  main_image_url: string;
  main_image_public_id?: string | null;
  created_at: string;
  price_period?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  description?: string;

  // ⭐️ แก้ไข: ใช้ Type 'PropertyImage' ที่เราเพิ่งสร้าง
  images?: PropertyImage[];

  // ⭐️ เพิ่ม: Array ของ Amenities (จาก Backend)
  amenities?: Amenity[];

  view_count?: number;

  availability?: string;
}