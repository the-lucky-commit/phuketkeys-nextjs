/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- เพิ่มส่วนนี้เข้ามา ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // -----------------------
};

export default nextConfig;