import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast'; // <-- 1. Import เข้ามา

export const metadata: Metadata = {
  title: "Phuket Keys Admin",
  description: "Property management for Phuket Keys",
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
        <Toaster position="top-center" /> {/* <-- 2. เพิ่ม Component นี้เข้ามา */}
        {children}
      </body>
    </html>
  );
}