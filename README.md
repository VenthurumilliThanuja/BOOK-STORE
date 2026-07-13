# BookStore MERN Application

BookStore is a complete MERN stack online book shopping system with MongoDB, Express.js, React.js, Node.js, Bootstrap 5, Axios, JWT authentication, bcrypt password hashing, role-based access, cart, checkout, orders, reviews, and admin management.

## Software Requirements

- Node.js v18+
- npm
- MongoDB Community Server or MongoDB Atlas
- MongoDB Compass
- Postman
- VS Code
- Git

## Hardware Requirements

- Windows 10/11
- Minimum 8 GB RAM
- Intel i5 or equivalent

## Folder Structure

```text
BookStore/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    uploads/
    utils/
    server.js
  frontend/
    public/
    src/
      components/
      context/
      pages/
      services/
      App.jsx
      index.jsx
  postman_collection.json
```

## Demo Links

- Demo Video: https://drive.google.com/drive/folders/13aU6ki1u1hbIdqX76fi4Id9-ShWxj73D?usp=drive_link
- MERN Phase-wise: https://drive.google.com/drive/folders/1jVzuuZEEUaIF8gmhVsU2URZPwaHtfMTo?usp=drive_link

## Local Setup

1. Install dependencies.

```bash
npm run install-all
```

2. Create backend environment file.

```bash
copy backend\.env.example backend\.env
```

3. Create frontend environment file.

```bash
copy frontend\.env.example frontend\.env
```

4. Start MongoDB locally or update `backend/.env` with your MongoDB Atlas URI.

5. Insert sample data.

```bash
npm run seed
```

6. Run backend.

```bash
npm run backend
```

7. Run frontend in a second terminal.

```bash
npm run frontend
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Sample Login

Admin:

```text
admin@bookstore.com
admin123
```

User:

```text
user@bookstore.com
user123
```

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`
- `POST /api/auth/forgot-password`
- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`
- `POST /api/orders`
- `GET /api/orders`
- `PUT /api/orders/:id/cancel`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id`
- `POST /api/reviews`
- `GET /api/reviews/:bookId`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`
- `GET /api/admin/stats`

## Postman

Import `postman_collection.json` into Postman. Login first to store the JWT token in the collection variable.

## Deployment

Frontend deployment target: Vercel.

Backend deployment target: Render.

Database deployment target: MongoDB Atlas.

For production, set environment variables in the hosting dashboards:

- Backend: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `NODE_ENV`
- Frontend: `VITE_API_URL`
