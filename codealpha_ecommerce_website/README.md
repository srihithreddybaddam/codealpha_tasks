# ⚡ BASKETLY — Production-Ready Indian Grocery Marketplace

> **CodeAlpha Full-Stack Engineering Internship Submission**  
> A state-of-the-art, high-performance E-Commerce platform built with React, Node.js, Express, MongoDB, and Tailwind CSS. Designed specifically for modern hyperlocal grocery and lifestyle commerce in India.

---

## 🌟 Key Features

- **🛒 500-Item Organic & Pantry Catalog**: 500 unique Indian grocery, produce, dairy, bakery, snacks, and household products across 14 categories with high-resolution Unsplash image links.
- **📍 Indian E-Commerce Address Selector**: Header address selector positioned beside the logo displaying `Delivering to [Area], [PIN]` with local storage persistence and interactive address management modal.
- **⚡ 10-Minute Express Hyperlocal Delivery**: Standard (1-2 Days) vs 10-Minute Express priority dispatch.
- **🌀 Smart Interleaved Category Distribution**: Homepage discovery feed dynamically alternates categories to prevent repetitive items from appearing side-by-side.
- **🛡️ Role-Protected Admin Dashboard (`/admin`)**: 11 KPI analytics cards, complete Product CRUD, Order Status Timeline update, and Customer Block/Unblock control.
- **🧾 Downloadable GST Tax Invoice**: Printable and downloadable GST-compliant Tax Invoice featuring company letterhead, GSTIN (`36AAACA0000A1Z5`), itemized breakdown, taxes (5%), delivery, and handling charges.
- **🚚 Visual Delivery Timeline**: 5-step progress stepper (`Order Placed` → `Confirmed` → `Packed` → `Out For Delivery` → `Delivered`) on user order history pages.
- **🔔 Floating Toast Notification System**: Real-time non-intrusive toast notifications for Cart, Wishlist, Authentication, and Order actions.
- **💰 Automatic Delivery & Handling Rules**: FREE shipping for orders ≥ ₹199 (₹30 for orders < ₹199), plus a ₹5 handling fee automatically computed.
- **🌙 Permanent Premium Dark Theme**: Deep slate dark mode aesthetic (`#0F172A`) with glassmorphism cards and smooth micro-interactions.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, React Router v6, React Icons |
| **Backend** | Node.js, Express.js, RESTful API Architecture |
| **Database** | MongoDB, Mongoose ODM (with seamless in-memory fallback) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt Password Hashing, Role-based Middleware |
| **Styling** | Custom Tailwind CSS Design Tokens, Plus Jakarta Sans Typography |

---

## 📁 Repository Structure

```
codealpha ecommerce website/
├── client/                      # React + Vite Frontend Application
│   ├── public/                  # Static Public Assets
│   ├── src/
│   │   ├── components/          # Reusable UI & Layout Components
│   │   │   ├── common/          # Button, Card, Input, Modal, TaxInvoice
│   │   │   ├── layout/          # Navbar, Footer, MobileNav
│   │   │   └── product/         # ProductCard, FilterSidebar, QuickViewModal
│   │   ├── contexts/            # React Contexts (Auth, Cart, Wishlist, Toast, Product)
│   │   ├── hooks/               # Custom React Hooks
│   │   ├── layouts/             # MainLayout, AuthLayout, AdminLayout
│   │   ├── pages/               # Home, Products, ProductDetails, Cart, Wishlist, Checkout, Payment, Orders, Profile, AdminDashboard
│   │   ├── routes/              # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/            # Client API Services
│   │   └── styles/              # Global Tailwind CSS Styles
│   ├── .env.example             # Client Environment Variables Template
│   ├── package.json             # Frontend Dependencies & Scripts
│   └── vite.config.js           # Vite Configuration
│
├── server/                      # Node.js + Express Backend API Server
│   ├── config/                  # DB Connection & Env Configuration
│   ├── controllers/             # Express API Route Controllers
│   ├── data/                    # 500-Item Dataset & Category Mapping
│   ├── middleware/              # JWT Auth, Logger, Error Handling Middleware
│   ├── models/                  # Mongoose Schemas (User, Product, Order, Category, Cart)
│   ├── routes/                  # API Endpoint Routers
│   ├── services/                # Backend Business Logic Services
│   ├── .env.example             # Server Environment Variables Template
│   ├── package.json             # Backend Dependencies & Scripts
│   └── server.js                # Express Application Entry Point
│
├── .gitignore                   # Git Ignore Rules
└── README.md                    # Project Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (Optional — includes automatic in-memory dataset fallback)

### 1. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env

# Start development server with Nodemon
npm run dev
```
Backend API server will run at: `http://localhost:5000`  
Health Check: `http://localhost:5000/api/health`

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env

# Start Vite dev server
npm run dev
```
Frontend Web App will run at: `http://localhost:3000`

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Customer** | `john@example.com` | `Password123` | Store, Cart, Checkout, Orders, Profile |
| **Admin** | `admin@example.com` | `AdminPass123` | Full Admin Dashboard (`/admin`), Product/Order CRUD |

---

## 📄 License & Credits

Built for the **CodeAlpha Full-Stack Engineering Internship**.  
© 2026 Aetheria Marketplace Studio. All Rights Reserved.
