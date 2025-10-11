export const getAuthHeaders = () => {
  // ตรวจสอบให้แน่ใจว่าโค้ดนี้ทำงานฝั่งเบราว์เซอร์เท่านั้นก่อนเรียกใช้ localStorage
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' };
  }

  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};