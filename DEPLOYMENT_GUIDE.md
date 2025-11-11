# 🚀 Phuket Keys - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Completed Tasks
- [x] ลบไฟล์ที่ไม่จำเป็นทิ้ง (SQL files, test files, documentation)
- [x] ตรวจสอบ environment variables
- [x] ทดสอบ build frontend (สำเร็จ)
- [x] ตรวจสอบ backend dependencies
- [x] แก้ไข .gitignore

---

## 🗄️ Database: Neon PostgreSQL

### ข้อมูลที่มีอยู่แล้ว:
- **Database**: `neondb`
- **Connection String**: `postgresql://neondb_owner:npg_w6MbsjDtdR9W@ep-steep-resonance-a1zzxmdu.ap-southeast-1.aws.neon.tech/neondb`
- **Region**: Singapore (ap-southeast-1)

### Data Summary:
- **Properties**: 30 รายการ
- **Admins**: 5 accounts
- **Users**: 5 accounts
- **Default Password**: `password123`

---

## 🌐 Frontend Deployment: Vercel

### ขั้นตอนการ Deploy:

1. **Push โค้ดขึ้น GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - ไปที่ https://vercel.com
   - Import project จาก GitHub
   - เลือก repository: `phuketkeys-nextjs`

3. **ตั้งค่า Environment Variables ใน Vercel**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
   NEXTAUTH_SECRET=your-super-secret-key-that-is-long-and-random
   NEXTAUTH_URL=https://your-vercel-domain.vercel.app
   ```

4. **Deploy!**
   - Vercel จะ auto-deploy ทุกครั้งที่ push

---

## 🖥️ Backend Deployment: Render

### ขั้นตอนการ Deploy:

1. **สร้าง Web Service ใหม่บน Render**
   - ไปที่ https://render.com
   - เลือก "New +" → "Web Service"
   - Connect GitHub repository

2. **ตั้งค่า Build Settings**
   - **Name**: `phuketkeys-backend`
   - **Environment**: Node
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `phuket-keys-project (backend)`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **ตั้งค่า Environment Variables**
   ```
   PORT=10000
   DATABASE_URL=postgresql://neondb_owner:npg_w6MbsjDtdR9W@ep-steep-resonance-a1zzxmdu.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   JWT_SECRET=your-super-secret-key-that-is-long-and-random
   CLOUD_NAME=drmaano4j
   API_KEY=228561925674273
   API_SECRET=d2BfIxjoUsLBnaKBOZ-TKBMP8oo
   SENDGRID_API_KEY=your-sendgrid-api-key-here
   SENDGRID_SENDER_EMAIL=noreply@phuketkeys.com
   ```

4. **Deploy!**
   - คลิก "Create Web Service"
   - รอ deployment สำเร็จ (3-5 นาที)

---

## 🔄 Post-Deployment Steps

### หลังจาก Deploy Backend:
1. Copy Backend URL จาก Render (เช่น `https://phuketkeys-backend.onrender.com`)
2. อัพเดท Environment Variables ใน Vercel:
   - `NEXT_PUBLIC_API_URL` = Backend URL
   - `NEXT_PUBLIC_BACKEND_URL` = Backend URL
3. Redeploy Frontend ใน Vercel

### หลังจาก Deploy Frontend:
1. Copy Frontend URL จาก Vercel (เช่น `https://phuketkeys.vercel.app`)
2. อัพเดท Environment Variable ใน Render:
   - `FRONTEND_URL` = Frontend URL
3. Redeploy Backend ใน Render (หรือรอ auto-redeploy)

---

## 👤 Login Credentials

### Admin Accounts:
- **Username**: `admin1`, `admin2`, `admin3`, `admin4`, `manager1`
- **Password**: `password123`

### Customer Accounts:
- **Username**: `john_doe`, `sarah_smith`, `mike_chen`, `lisa_jones`, `david_wilson`
- **Password**: `password123`

---

## 🧪 Testing After Deployment

### ทดสอบ API Endpoints:
```bash
# Login
curl -X POST https://your-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"password123"}'

# Get Properties
curl https://your-backend.onrender.com/api/properties

# Get Stats (with token)
curl https://your-backend.onrender.com/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### ทดสอบ Frontend:
1. เข้าหน้าแรก: `https://your-vercel-app.vercel.app`
2. ทดสอบ Login: `/login`
3. ทดสอบ Admin Dashboard: `/admin/dashboard`
4. ทดสอบ Properties List: `/properties`

---

## ⚠️ Common Issues

### Issue: CORS Error
**Solution**: ตรวจสอบว่า `FRONTEND_URL` ใน Backend ตรงกับ Vercel URL

### Issue: Database Connection Failed
**Solution**: ตรวจสอบ `DATABASE_URL` ว่ามี SSL mode (`?sslmode=require`)

### Issue: 401 Unauthorized
**Solution**: ตรวจสอบว่า JWT_SECRET ตรงกันทั้ง Frontend และ Backend

### Issue: Render Service Sleeping
**Solution**: 
- Free tier จะ sleep หลัง 15 นาที
- Upgrade เป็น paid plan ($7/month) เพื่อ always-on
- หรือใช้ cron job ping ทุก 10 นาที

---

## 📊 Project Structure

```
phuketkeys-nextjs/
├── src/                      # Frontend source
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   ├── context/              # Context providers
│   └── lib/                  # Utilities
├── public/                   # Static assets
├── phuket-keys-project (backend)/
│   ├── server.js             # Express server
│   ├── package.json          # Backend dependencies
│   └── .env                  # Backend environment (local)
├── .env.local                # Frontend environment (local)
├── package.json              # Frontend dependencies
└── vercel.json               # Vercel config
```

---

## 🎯 Features

### Frontend:
- ✅ Next.js 15.5.4 (App Router + Turbopack)
- ✅ React 19.1.0
- ✅ TypeScript
- ✅ Responsive Design
- ✅ Admin Dashboard with Charts
- ✅ Property Management (CRUD)
- ✅ User Authentication (JWT)
- ✅ Customer Login & Favorites
- ✅ Search & Filtering
- ✅ Export to Excel

### Backend:
- ✅ Node.js + Express
- ✅ PostgreSQL (Neon)
- ✅ JWT Authentication
- ✅ bcrypt Password Hashing
- ✅ RESTful API
- ✅ File Upload (Cloudinary)
- ✅ Email Service (SendGrid)
- ✅ CORS configured

---

## 🔐 Security Notes

1. **เปลี่ยน Default Passwords**: หลัง deploy แล้วควรเปลี่ยน password ของ admin ทั้งหมด
2. **JWT_SECRET**: ใช้ key ที่ปลอดภัยและเก็บไว้เป็นความลับ
3. **Database Credentials**: อย่า commit ลง Git
4. **API Keys**: ใช้ environment variables เสมอ

---

## 📞 Support

หากมีปัญหาในการ deploy:
1. ตรวจสอบ Logs ใน Render/Vercel Dashboard
2. ตรวจสอบ Environment Variables ว่าถูกต้องครบถ้วน
3. ทดสอบ API ด้วย Postman หรือ curl

---

**Ready to Deploy!** 🚀
