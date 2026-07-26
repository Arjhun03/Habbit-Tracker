# HabitFlow - Supabase Habit Tracker

A simple, minimal, production-quality, and interview-ready Habit Tracker application built with React, Express, Node.js, and Supabase.

---

## 🚀 Features

- **JWT Authentication**: User Registration, Login, and Profile protection with `bcryptjs` password hashing.
- **Habit Management**: Full CRUD operations (Create, View, Edit, Delete habits).
- **Daily Completion Tracking**: Mark habits as completed once per day.
- **Streak Calculation**: Real-time current streak calculation (🔥 Days) based on consecutive daily habit logs.
- **Minimal & Clean UI**: Styled with Tailwind CSS for a modern, responsive user interface.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **Utilities**: dotenv, cors

---

## 📁 Project Structure

```text
HabbitFlow/
│
├── server/
│   ├── config/
│   │   └── supabase.js           # Supabase client configuration
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   └── habitController.js    # Habit CRUD, completion & streak calculation
│   ├── middleware/
│   │   ├── authMiddleware.js     # Protects routes via JWT verification
│   │   └── errorMiddleware.js    # Global error & 404 handlers
│   ├── supabase/
│   │   └── schema.sql            # Supabase table setup
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── habitRoutes.js        # Habit endpoints
│   ├── utils/
│   │   ├── generateToken.js      # JWT signing helper
│   │   └── dateUtils.js          # Standardized date formatting & helpers
│   ├── .env.example
│   ├── .env
│   ├── app.js                    # Express application setup
│   ├── server.js                 # Server listener entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HabitCard.jsx     # Individual habit card
│   │   │   ├── HabitModal.jsx    # Reusable Add/Edit habit modal
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── ProtectedRoute.jsx# Auth wrapper for private routes
│   │   │   └── PublicRoute.jsx   # Auth wrapper for guest routes
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global authentication state
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx # Main habit tracking dashboard
│   │   │   ├── LoginPage.jsx     # Login form
│   │   │   └── RegisterPage.jsx  # Registration form
│   │   ├── services/
│   │   │   └── api.js            # Axios configuration with JWT interceptor
│   │   ├── App.jsx               # Application routes
│   │   ├── main.jsx              # React DOM entry point
│   │   └── index.css             # Tailwind styling imports
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase project URL and publishable key

---

### Step 1: Backend Setup

1. Open terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure your Environment Variables:
   - Edit the `.env` file inside `server/`:
   ```env
   PORT=5050
   SUPABASE_URL=https://wdwhkfxvjjszziwrhqcd.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_cnvEQhMc9-IEBDsqfMvQUA_z8kQdDXN
   JWT_SECRET=your_secret_key
   ```

4. Create the Supabase tables:
   - Run the SQL from `server/supabase/schema.sql` in the Supabase SQL editor.

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend API server will run on `http://localhost:5050`.

---

### Step 2: Frontend Setup

1. In a new terminal window, navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 📡 REST API Documentation

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | Public |
| `GET` | `/api/auth/profile` | Get logged-in user profile | Protected |

### Habit Routes (`/api/habits`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/habits` | Get all habits for logged-in user | Protected |
| `POST` | `/api/habits` | Create a new habit | Protected |
| `PUT` | `/api/habits/:id` | Update habit title/description | Protected |
| `DELETE` | `/api/habits/:id` | Delete a habit & its completion logs | Protected |
| `PATCH` | `/api/habits/:id/complete` | Toggle/Mark habit as completed for today | Protected |

---

## 🔐 Security Features
- **Password Hashing**: Passwords stored securely using `bcryptjs` with salt rounds.
- **JWT Protection**: Private routes on both backend and frontend require a valid JWT token.
- **Input Sanitization**: Email lowercasing and trimming for all user inputs.
# Habbit-Tracker
