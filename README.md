# FinTrack

FinTrack is a full-stack personal finance tracker for managing income, expenses, monthly budgets, and category-based insights.

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, JWT auth, Mongoose
- Database: MongoDB

## Core Features

- User authentication (register/login/me)
- Transaction CRUD (income and expense)
- Category management (default + custom categories)
- Monthly budget tracking with utilization percentage
- Dashboard summary (income, expense, net, budget remaining)
- Expense by category chart
- Date/category filters
- CSV export for filtered transactions

## Project Structure

```text
fintrack/
  client/   # React + Vite frontend
  server/   # Express API + MongoDB models/controllers/routes
  static/   # Legacy static prototype files (not used by current app)
  data/     # Local data artifacts (if any)
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or cloud)

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fintrack
JWT_SECRET=replace_with_a_strong_secret
CLIENT_URL=http://localhost:5173
```

Optional `client/.env` (needed only if API is not proxied through Vite):

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Development Setup

1. Install server dependencies
```bash
cd server
npm ci
```

2. Install client dependencies
```bash
cd ../client
npm ci
```

3. Start backend (terminal 1)
```bash
cd server
npm run dev
```

4. Start frontend (terminal 2)
```bash
cd client
npm run dev
```

5. Open app
```text
http://localhost:5173
```

## Available Scripts

In `server/`:
- `npm run dev` - start API with nodemon
- `npm start` - start API with node

In `client/`:
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build locally

## API Overview

Base URL: `http://localhost:5000/api`

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /transactions`
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`
- `GET /categories`
- `POST /categories`
- `GET /budget/:month` (format: `YYYY-MM`)
- `POST /budget`
- `GET /dashboard/summary?month=YYYY-MM`
- `GET /export/csv`

Protected routes require:

```http
Authorization: Bearer <jwt_token>
```

## Notes

- Default categories are auto-seeded by the backend.
- Frontend stores JWT token in local storage (`fintrack_token`).
- If frontend fails due to missing packages, run `npm ci` inside `client/` again.

## License

No license file is currently included. Add a `LICENSE` file if this project is intended for public reuse.
