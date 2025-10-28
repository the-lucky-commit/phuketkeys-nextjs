// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // ⭐️ เราต้องติดตั้ง library นี้
import { DecodedUser } from '@/lib/types';
import { getAuthHeaders } from '@/lib/auth'; // ⭐️ เราใช้ lib เดิม!

// 1. กำหนดว่า Context ของเราจะเก็บอะไรบ้าง
interface AuthContextType {
  user: DecodedUser | null; // ข้อมูล User ที่ Login
  token: string | null;      // JWT Token
  login: (token: string) => void; // ฟังก์ชันสำหรับ Login
  logout: () => void;           // ฟังก์ชันสำหรับ Logout
  isLoading: boolean;        // สถานะ (กำลังโหลดข้อมูล User?)

  // ⭐️ ส่วนจัดการ Favorites
  favoriteIds: Set<number>; // ⭐️ ใช้ Set เพื่อเก็บ ID ที่ถูกใจ
  addFavorite: (propertyId: number) => void;
  removeFavorite: (propertyId: number) => void;
}

// 2. สร้าง Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. สร้าง "Provider" (ตัวหุ้ม)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ⭐️ เริ่มที่ "กำลังโหลด"
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  // 4. [สำคัญ] useEffect นี้จะทำงาน "ครั้งเดียว" ตอนเปิดเว็บ
  //    เพื่อเช็คว่ามี Token เก่าใน localStorage หรือไม่
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('phuket-keys-customer-token'); // ⭐️ ใช้ Key ใหม่สำหรับลูกค้า
      if (storedToken) {
        const decodedUser: DecodedUser = jwtDecode(storedToken);

        // ⭐️ (ป้องกัน) เช็คว่า Token นี้เป็นของ 'customer' จริงๆ
        if (decodedUser.role === 'customer') {
          setToken(storedToken);
          setUser(decodedUser);
        } else {
          // ถ้า Token เป็นของ Admin ให้ลบทิ้ง (กันปนกัน)
          localStorage.removeItem('phuket-keys-customer-token');
        }
      }
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem('phuket-keys-customer-token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 5. [สำคัญ] เมื่อ User Login (ได้ Token ใหม่)
  //    ให้ดึง "รายการโปรด" ของเขามาเก็บไว้
  const fetchFavorites = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/favorites`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // ⭐️ ใช้ Token ที่เพิ่งได้มา
        }
      });
      if (response.ok) {
        const ids: number[] = await response.json();
        setFavoriteIds(new Set(ids));
      } else {
        console.error("Failed to fetch favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, []);

  // 6. ฟังก์ชันที่ให้ลูกเรียกใช้ (Login / Logout)
  const login = (newToken: string) => {
    try {
      const decodedUser: DecodedUser = jwtDecode(newToken);
      if (decodedUser.role === 'customer') {
        localStorage.setItem('phuket-keys-customer-token', newToken); // ⭐️ บันทึก Token ใหม่
        setToken(newToken);
        setUser(decodedUser);
        fetchFavorites(newToken); // ⭐️ ดึง Favorites ทันที
      } else {
        console.warn("Attempted to log in non-customer user");
      }
    } catch (error) {
      console.error("Failed to decode token on login", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('phuket-keys-customer-token'); // ⭐️ ลบ Token
    setToken(null);
    setUser(null);
    setFavoriteIds(new Set()); // ⭐️ ล้าง Favorites
  };

  // 7. ฟังก์ชันจัดการ Favorites (สำหรับปุ่มหัวใจ)
  const addFavorite = async (propertyId: number) => {
    if (!token) return; // ถ้าไม่ Login, ไม่ต้องทำอะไร
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/favorites`, {
        method: 'POST',
        headers: getAuthHeaders('customer'),
        body: JSON.stringify({ propertyId })
      });
      if (response.ok) {
        setFavoriteIds(prev => new Set(prev).add(propertyId)); // ⭐️ อัปเดต State
      }
    } catch (error) {
      console.error("Failed to add favorite", error);
    }
  };

  const removeFavorite = async (propertyId: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders('customer'),
      });
      if (response.ok) {
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId); // ⭐️ อัปเดต State
          return newSet;
        });
      }
    } catch (error) {
      console.error("Failed to remove favorite", error);
    }
  };

  // 8. ส่งค่าทั้งหมดให้ Children
  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    favoriteIds,
    addFavorite,
    removeFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 9. สร้าง Hook (ทางลัด) ให้ Component อื่นเรียกใช้ง่ายๆ
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}