# Everest Dine Web Oasis

Everest Restoran uchun zamonaviy web ilovasi.

## 🚀 O'rnatish

### Backend o'rnatish

1. Backend papkasiga o'ting:
```bash
cd backend
```

2. Dependencelarni o'rnating:
```bash
npm install
```

3. `.env` faylini yarating:
```bash
# backend/.env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user1:1234sss@cluster0.u7wp4gl.mongodb.net/everest-restaurant?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=everest-restaurant-super-secret-jwt-key-2024
CLIENT_URL=http://localhost:8080
```

4. Serverni ishga tushiring:
```bash
npm run dev
```

### Frontend o'rnatish

1. Frontend papkasiga o'ting:
```bash
cd frontend
```

2. Dependencelarni o'rnating:
```bash
npm install
```

3. `.env` faylini yarating:
```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

4. Ilovani ishga tushiring:
```bash
npm run dev
```

## 🔧 Tuzatilgan Xatoliklar

1. **App.tsx** - Noto'g'ri joyda yozilgan kodlar olib tashlandi
2. **Register sahifasi** - Route qo'shildi va API endpoint to'g'rilandi
3. **AuthContext** - TypeScript tiplari to'liq belgilandi
4. **API integratsiyasi** - Register sahifasida axios o'rniga apiFetch ishlatildi

## 🆕 Yangi Admin Panel Funksiyalari

### 📦 Mahsulotlar boshqaruvi
- ✅ Yangi mahsulot qo'shish
- ✅ Mahsulotni tahrirlash
- ✅ Mahsulotni o'chirish
- ✅ Mahsulotlar ro'yxatini ko'rish

### 🛒 Buyurtmalar boshqaruvi
- ✅ Barcha buyurtmalarni ko'rish
- ✅ Buyurtma statusini o'zgartirish
- ✅ Buyurtma ma'lumotlarini ko'rish
- ✅ Buyurtma statistikalarini ko'rish

### 💬 Xabarlar boshqaruvi
- ✅ Contact formadan kelgan xabarlarni ko'rish
- ✅ Xabarni o'qilgan deb belgilash
- ✅ Xabar statusini o'zgartirish

### 📊 Dashboard statistikalar
- ✅ Jami mahsulotlar soni
- ✅ Jami buyurtmalar soni
- ✅ Yangi xabarlar soni
- ✅ Jami daromad

## 📁 Loyiha tuzilishi

```
everest-dine-web-oasis-main/
├── backend/          # Node.js + Express API
│   ├── controllers/  # API controllers
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── middleware/   # Auth & admin middleware
├── frontend/         # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/    # Sahifalar
│   │   ├── components/ # Komponentlar
│   │   └── context/  # React context
└── README.md
```

## 🛠️ Texnologiyalar

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router
- React Query

## 🔐 Admin kirish

Admin paneliga kirish uchun:
- Email: `mustafoyev7788@gmail.com`
- Har qanday parol (backend da avtomatik admin qiladi)

## 🚨 Muhim Eslatma

Backend va frontend ishga tushishidan oldin `.env` fayllarini yaratishni unutmang!

## 📱 API Endpoints

### Auth
- `POST /api/auth/signup` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/me` - Foydalanuvchi ma'lumotlari
- `POST /api/auth/logout` - Chiqish

### Products
- `GET /api/products` - Barcha mahsulotlar
- `POST /api/products` - Yangi mahsulot (admin)
- `PUT /api/products/:id` - Mahsulotni tahrirlash (admin)
- `DELETE /api/products/:id` - Mahsulotni o'chirish (admin)

### Orders
- `POST /api/orders` - Yangi buyurtma
- `GET /api/orders` - Barcha buyurtmalar (admin)
- `PUT /api/orders/:id/status` - Buyurtma statusini o'zgartirish (admin)

### Contact
- `POST /api/contact` - Xabar yuborish
- `GET /api/contact` - Barcha xabarlar (admin)
- `PUT /api/contact/:id/read` - Xabarni o'qilgan deb belgilash (admin)
# everest-restaurant
