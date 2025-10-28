// ⭐️ Key ของ Admin
const ADMIN_TOKEN_KEY = 'token'; 
// ⭐️ Key ใหม่ของ Customer
const CUSTOMER_TOKEN_KEY = 'phuket-keys-customer-token'; 

export const getAuthHeaders = (tokenKey: 'admin' | 'customer' = 'admin') => {
  // ตรวจสอบฝั่ง Browser
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' };
  }

  // ⭐️ เลือก Key ที่ถูกต้อง
  const key = (tokenKey === 'admin') ? ADMIN_TOKEN_KEY : CUSTOMER_TOKEN_KEY;

  const token = localStorage.getItem(key);

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};