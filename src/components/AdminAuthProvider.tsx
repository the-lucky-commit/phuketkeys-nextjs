'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { DecodedUser } from '@/lib/types';

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.replace('/login');
          return;
        }

        // Decode and verify token
        const decodedUser: DecodedUser = jwtDecode(token);
        
        // Check if user is admin
        if (decodedUser.role !== 'admin') {
          localStorage.removeItem('token');
          router.replace('/login');
          return;
        }

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedUser.exp && decodedUser.exp < currentTime) {
          localStorage.removeItem('token');
          router.replace('/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('token');
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}