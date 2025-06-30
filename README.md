# Everest Restaurant - Full Stack Application

A modern restaurant management system with online ordering, reservations, and admin panel.

## 🚀 Features

### Customer Features
- **Online Menu**: Browse and order food items
- **Shopping Cart**: Add items and manage cart
- **Reservations**: Book tables online
- **User Authentication**: Sign up, login, and profile management
- **Order Tracking**: Track your orders in real-time
- **Favorites**: Save your favorite dishes
- **Multi-language Support**: Uzbek, English, and Russian

### Admin Features
- **Dashboard**: Analytics and overview
- **Product Management**: Add, edit, and manage menu items
- **Order Management**: Process and track orders
- **Reservation Management**: Manage table bookings
- **User Management**: View and manage customers
- **Payment Management**: Track payments and transactions
- **Contact Messages**: Handle customer inquiries
- **Real-time Notifications**: Live updates via WebSocket

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Payme** for payment processing
- **Cloudinary** for image uploads
- **Nodemailer** for email notifications

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Socket.io Client** for real-time features
- **i18next** for internationalization

## 📁 Project Structure

```
everest-restaurant/
├── backend/                 # Node.js API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── locales/       # Translation files
│   │   └── lib/           # Utility libraries
│   └── public/            # Static assets
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd everest-restaurant/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/everest_restaurant

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:8080

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Payme (for payments)
PAYME_MERCHANT_ID=your_payme_merchant_id
PAYME_SECRET_KEY=your_payme_secret_key
PAYME_TEST_MODE=true
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Everest Restaurant
VITE_APP_VERSION=1.0.0

# Google Maps (optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Socket.io
VITE_SOCKET_URL=http://localhost:5000
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Prepare for deployment**
   ```bash
   cd backend
   npm run build
   ```

2. **Set environment variables** in your hosting platform

3. **Deploy** using your preferred platform

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy** the `dist` folder to your hosting platform

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products/:id` - Update product (admin)
- `DELETE /api/admin/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/admin/orders` - Get all orders (admin)
- `PUT /api/admin/orders/:id` - Update order status (admin)

### Reservations
- `GET /api/reservations` - Get user reservations
- `POST /api/reservations` - Create reservation
- `GET /api/admin/reservations` - Get all reservations (admin)
- `PUT /api/admin/reservations/:id` - Update reservation (admin)

### Payments
- `POST /api/payments/create` - Create payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/admin/payments` - Get all payments (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mustafoyev Jo'rabek**
- Email: mustafoyev@gmail.com
- GitHub: [@mustafoyev](https://github.com/mustafoyev)

## 🙏 Acknowledgments

- Shadcn/ui for beautiful components
- Tailwind CSS for styling
- React community for amazing tools

# Everest Restaurant Fullstack Deployment Guide

This guide will help you deploy the Everest Restaurant application (Node.js/Express backend + React frontend) to [Render.com](https://render.com) or similar cloud platforms. The instructions are also suitable for Railway, Netlify, Vercel, etc.

---

## 1. Prerequisites
- **MongoDB Atlas** account (for cloud database)
- **Payme** merchant credentials (for payment integration)
- **GitHub** account (for easy deployment from repo)

---

## 2. Environment Variables

### Backend (`backend/.env`):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_SECRET
PAYME_MERCHANT_ID=YOUR_PAYME_MERCHANT_ID
PAYME_SECRET_KEY=YOUR_PAYME_SECRET_KEY
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend (`frontend/.env`):
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 3. Backend Deployment (Render.com)

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **New +** → **Web Service**
   - Connect your GitHub repo or upload ZIP
   - Set **Root Directory** to `backend`

2. **Set Environment Variables**
   - Add all variables from the backend `.env` example above

3. **Configure Build & Start Commands**
   - **Build Command:**
     ```
     npm install
     ```
   - **Start Command:**
     ```
     npm start
     ```

4. **Deploy**
   - Click **Create Web Service**
   - Wait for build & deployment to finish
   - Note your backend URL (e.g., `https://your-backend-url.onrender.com`)

---

## 4. Frontend Deployment (Render.com)

1. **Create a new Static Site**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **New +** → **Static Site**
   - Connect your GitHub repo or upload ZIP
   - Set **Root Directory** to `frontend`

2. **Set Environment Variables**
   - Add all variables from the frontend `.env` example above
   - Make sure `VITE_API_URL` points to your deployed backend `/api` endpoint

3. **Configure Build & Publish**
   - **Build Command:**
     ```
     npm install && npm run build
     ```
   - **Publish Directory:**
     ```
     dist
     ```

4. **Deploy**
   - Click **Create Static Site**
   - Wait for build & deployment to finish
   - Note your frontend URL (e.g., `https://your-frontend-url.onrender.com`)

---

## 5. MongoDB Atlas Setup
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Add a database user and password
- Whitelist Render's IPs or allow access from anywhere (for testing)
- Copy your connection string and use it as `MONGODB_URI`

---

## 6. Payme Integration
- Register at [Payme](https://payme.uz/) and get your **merchant ID** and **secret key**
- Use test credentials for development, real ones for production
- Set `PAYME_MERCHANT_ID` and `PAYME_SECRET_KEY` in backend environment

---

## 7. Docker (Optional)
Both backend and frontend have `Dockerfile` for containerized deployment. You can use them for custom cloud/VPS setups.

---

## 8. CORS & URLs
- Make sure `FRONTEND_URL` in backend `.env` matches your deployed frontend URL
- Make sure `VITE_API_URL` in frontend `.env` matches your deployed backend `/api` endpoint

---

## 9. Useful Render Settings
- **Health Check Path (backend):** `/api/health`
- **Auto Deploy:** Enable for both services for CI/CD
- **Environment Variables:** Always keep secrets safe, never commit `.env` to git

---

## 10. Troubleshooting
- **CORS errors:** Double-check URLs in `.env` files
- **MongoDB connection errors:** Check IP whitelist and credentials
- **Payme errors:** Use correct merchant/test credentials and check callback URLs
- **Frontend not connecting to backend:** Make sure `VITE_API_URL` is correct and backend is live

---

## 11. Example Directory Structure
```
everest-restaurant/
  backend/
    .env
    Dockerfile
    ...
  frontend/
    .env
    Dockerfile
    ...
  README.md
```

---

## 12. Contact
For help, contact the project maintainer or open an issue in the repository. # fullstacksite
# fullstacksite
