import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext'; // 1. Import (คุณทำแล้ว)
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Phuket Keys - Find Your Dream Home", // Title หลักของเว็บ
  description: "Experience luxury living with premium properties from PHUKET KEYS",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover",
  other: {
    "format-detection": "telephone=no"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        {/* --- ⬇️ 2. หุ้มทุกอย่างด้วย AuthProvider ⬇️ --- */}
        <AuthProvider>
        
          <Toaster position="top-center" />
          {children} {/* นี่คือที่ที่หน้าเว็บต่างๆ จะถูกนำมาแสดง */}
          
        </AuthProvider>
        {/* --- ⬆️ 3. สิ้นสุด AuthProvider ⬆️ --- */}
      </body>
    </html>
  );
}