// src/app/customer-login/page.tsx
'use client'; // ⭐️ 1. นี่คือ Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext'; // ⭐️ 2. Import hook ที่เราสร้าง
// ⭐️ 3. (สำคัญ) เราใช้ CSS จากหน้า Register ซ้ำได้เลย!
import styles from '../register/register.module.css'; 

export default function CustomerLoginPage() {
  const [username, setUsername] = useState(''); // ⭐️ 4. ใช้ username (หรือ email)
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth(); // ⭐️ 5. ดึงฟังก์ชัน login จาก AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const notification = toast.loading('Signing in...');

    try {
      // 6. ⭐️ ยิง API ไปที่ /api/customer-login
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // ⭐️ ส่งแค่ username/password
      });

      const data = await response.json();

      if (response.ok) {
        // 7. ⭐️ (สำคัญ) เมื่อ Login สำเร็จ, API จะส่ง Token กลับมา
        // เราเรียก login() เพื่อบันทึก Token นั้นลง Context
        login(data.accessToken); 
        
        toast.success('Signed in successfully!', { id: notification });
        router.push('/'); // ⭐️ 8. ส่งกลับไปหน้าแรก
      } else {
        // 9. ⭐️ แสดง Error (เช่น รหัสผ่านผิด)
        toast.error(`Login failed: ${data.error}`, { id: notification });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.', { id: notification });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your Phuket Keys account.</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username (or Email)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.footerText}>
  Don&apos;t have an account?{' '} {/* ⬅️ แก้ไขตรงนี้ */}
  <Link href="/register">Sign Up</Link>
</p>
      </div>
    </div>
  );
}