![carstore-server](https://github.com/user-attachments/assets/92fb852b-259b-4fa8-b94a-c4867b8f1e5f)


# 🚗 Car Store Server | Backend API

The backend server for CarStore provides a robust API to support the premium vehicles marketplace platform. This server handles authentication, product management, order processing, and administrative functions.

## 🌍 Live API
- **Project Name:** Car Store
- **API URL:** [https://car-store-server-ten.vercel.app](https://car-store-server-ten.vercel.app)
- **Live URL:** [https://car-store-client-ten.vercel.app](https://car-store-client-ten.vercel.app)
- **API Documentation:** [Postman Documentation](https://documenter.getpostman.com/view/31322920/2sAYdfrXUP)

## 🌟 Core Features

### 🔐 Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (Admin/User)
- Password hashing with bcrypt
- Token refresh mechanism
- Session management

### 👥 User Management
- User registration and login
- Profile management
- Role management
- Account status control
- Password security

### 📦 Product Management
- CRUD operations for products
- Product categorization
- Stock management
- Image handling
- Search and filtering

### 📊 Order Processing
- Order creation and management
- Payment integration with Shurjopay
- Order status tracking
- Invoice generation
- Sales analytics

## 🛠️ Technology Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Zod** for validation
- **Cors** for cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn
- TypeScript

### Installation

1. Clone the repository:

```bash
git clone https://github.com/hanif365/car-store-server.git

cd car-store-server

```
2. Install dependencies:

```bash
npm install
```
3. Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=365d
BCRYPT_SALT_ROUNDS=12

Shurjopay Configuration
SP_ENDPOINT=your_shurjopay_endpoint
SP_USERNAME=your_shurjopay_username
SP_PASSWORD=your_shurjopay_password
SP_PREFIX=your_shurjopay_prefix
SP_RETURN_URL=your_return_url
```

### Running the Application

Development mode:

```bash
npm run start:dev

```

Production build:

```bash
npm run build
npm start

```



## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products?brand=Toyota&inStock=true&searchTerm=Toyota&sortBy=price&sortOrder=asc&page=1&limit=2` - Get products with search, filter, sort, pagination functionality
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create product (Admin)
- `PATCH /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id` - Update order status (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `PATCH /api/users/:id` - Update user
- `PATCH /api/users/change-password` - Change password

## 🔒 Security Features

- Request validation using Zod
- Password hashing
- JWT token verification
- Role-based access control
- Error handling middleware
- CORS configuration


---
## 👨‍💼 Admin Credentials
```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

---

🚀 **Happy Coding!** 🏆
