import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Phuket Keys - Find Your Dream Home", // Title หลักของเว็บ
  description: "Experience luxury living with premium properties from PHUKET KEYS",
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
        <Toaster position="top-center" />
        {children} {/* นี่คือที่ที่หน้าเว็บต่างๆ (รวมถึง AdminLayout) จะถูกนำมาแสดง */}
      </body>
    </html>
  );
}