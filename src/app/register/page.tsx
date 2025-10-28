// src/app/register/page.tsx
'use client'; // ⭐️ 1. นี่คือ Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext'; // ⭐️ 2. Import hook ที่เราสร้าง
import styles from './register.module.css'; // ⭐️ 3. เราจะสร้าง CSS นี้

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // ⭐️ 4. เพิ่ม email (ตาม API)
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth(); // ⭐️ 5. ดึงฟังก์ชัน login จาก AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const notification = toast.loading('Creating account...');

    try {
      // 6. ⭐️ ยิง API ไปที่ /api/register (ที่เราสร้างใน server.js)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 7. ⭐️ (สำคัญ) เมื่อสมัครสำเร็จ, API จะส่ง Token กลับมา
        // เราเรียก login() เพื่อบันทึก Token นั้นลง Context
        login(data.accessToken); 
        
        toast.success('Account created successfully!', { id: notification });
        router.push('/'); // ⭐️ 8. ส่งกลับไปหน้าแรก
      } else {
        // 9. ⭐️ แสดง Error (เช่น Username ซ้ำ)
        toast.error(`Registration failed: ${data.error}`, { id: notification });
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
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join Phuket Keys today.</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={6}
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{' '}
          <Link href="/customer-login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}