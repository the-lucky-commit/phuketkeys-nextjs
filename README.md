# 🏠 PHUKET KEYS - Real Estate Platform

A modern, full-stack real estate management platform built with Next.js, featuring property listings, user management, and an advanced admin panel.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

---

## ✨ Features

### 🌐 Public Features
- **Property Listings** - Browse and search properties with advanced filters
- **Property Details** - Detailed property information with image galleries
- **Search & Filter** - By type, price range, location, and status
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Image Optimization** - Fast loading with Cloudinary CDN

### 👤 User Features
- **User Registration & Login** - Secure authentication system
- **Favorites System** - Save and manage favorite properties
- **Profile Management** - Update personal information and password
- **Property Browsing** - View all available properties

### 🔐 Admin Panel
- **Dashboard** - Real-time statistics and analytics
- **Property Management** - Full CRUD operations
- **Image Gallery Manager** - Upload and manage multiple images
- **User Management** - View and manage registered users
- **Export to Excel** - Export properties and user data
- **Featured Properties** - Toggle featured status for homepage

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (Turbopack)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** CSS Modules
- **Charts:** Recharts
- **Image Slider:** Swiper
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer + Cloudinary
- **Email:** SendGrid

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Cloudinary account
- SendGrid account (optional)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/the-lucky-commit/phuketkeys-nextjs.git
cd phuketkeys-nextjs
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd "phuket-keys-project (backend)"
npm install
cd ..
```

4. **Configure environment variables**

Frontend (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

Backend (`phuket-keys-project (backend)/.env`):
```env
PORT=3001
DATABASE_URL=your-postgresql-connection-string
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_SENDER_EMAIL=noreply@phuketkeys.com
```

5. **Start development servers**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
cd "phuket-keys-project (backend)"
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Admin Panel: http://localhost:3000/login

---

## 📦 Production Deployment

### Quick Deploy (10 minutes)

See detailed guides in:
- 📘 [`QUICK_START.md`](./QUICK_START.md) - 10-minute deployment guide
- 📋 [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) - Comprehensive checklist
- 🚀 [`RENDER_DEPLOY.md`](./phuket-keys-project%20(backend)/RENDER_DEPLOY.md) - Backend specific guide

### Deploy to Vercel (Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/the-lucky-commit/phuketkeys-nextjs)

1. Click the deploy button
2. Add environment variables
3. Deploy!

### Deploy to Render (Backend)

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set root directory: `phuket-keys-project (backend)`
4. Add environment variables
5. Deploy!

---

## 📖 Documentation

- 📘 **[User Manual](./USER_MANUAL.md)** - Complete guide for users and admins
- 🚀 **[Quick Start Guide](./QUICK_START.md)** - Fast deployment guide
- 📋 **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Detailed deployment steps
- ✅ **[Final Check Report](./FINAL_CHECK_REPORT.md)** - Production readiness report

---

## 🗂️ Project Structure

```
phuketkeys-nextjs/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (public)/          # Public routes
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # API routes
│   │   ├── login/             # Admin login
│   │   ├── customer-login/    # Customer login
│   │   ├── register/          # User registration
│   │   └── profile/           # User profile
│   ├── components/            # Reusable components
│   ├── context/               # React context (Auth)
│   ├── lib/                   # Utilities and API functions
│   └── types/                 # TypeScript types
├── phuket-keys-project (backend)/
│   ├── server.js              # Express server
│   ├── .env                   # Environment variables
│   └── package.json           # Backend dependencies
├── public/                    # Static assets
└── package.json               # Frontend dependencies
```

---

## 🔒 Security Features

- ✅ JWT Authentication (Admin + Customer separation)
- ✅ Password Hashing (bcrypt)
- ✅ SQL Injection Protection (Parameterized queries)
- ✅ CORS Protection
- ✅ Environment Variables (No secrets in code)
- ✅ HTTPS (Automatic on Vercel/Render)
- ✅ Role-Based Access Control
- ✅ XSS Protection

---

## 🎯 Performance

- ⚡ **First Load JS:** 129 kB (Excellent)
- 🖼️ **Image Optimization:** WebP/AVIF with Cloudinary CDN
- 🚀 **Build Time:** ~3 seconds with Turbopack
- 📦 **Code Splitting:** Automatic with Next.js
- 🎨 **Static Generation:** Where applicable

---

## 📊 Build Status

```bash
npm run build
```

✅ Production build successful  
✅ TypeScript compilation passed  
✅ ESLint checks passed  
✅ All routes optimized  

---

## 🧪 Testing

### Local Testing
```bash
# Frontend
npm run dev

# Backend
cd "phuket-keys-project (backend)"
npm start
```

### Production Build Test
```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**The Lucky Commit**
- GitHub: [@the-lucky-commit](https://github.com/the-lucky-commit)

---

## 🙏 Acknowledgments

- Next.js Team for the amazing framework
- Vercel for hosting and deployment
- Render for backend hosting
- Cloudinary for image CDN
- Neon for PostgreSQL database

---

## 📞 Support

For support, email support@phuketkeys.com or open an issue on GitHub.

---

## 🎉 Status

**Current Version:** 1.0.0  
**Status:** 🟢 Production Ready  
**Last Updated:** November 7, 2025

---

**⭐ If you find this project useful, please consider giving it a star!**

[![Star this repo](https://img.shields.io/github/stars/the-lucky-commit/phuketkeys-nextjs?style=social)](https://github.com/the-lucky-commit/phuketkeys-nextjs)
