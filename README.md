# Mission Test Webcastle

A full-stack web application with a **Next.js** frontend and an **Express + TypeScript** backend. It supports Google OAuth login, JWT-based authentication, and Google Calendar integration.

---

## Project Structure

```
mission_test_webcastle/
├── event-backend/   # Node.js / Express API (TypeScript)
└── frondend/        # Next.js frontend (TypeScript)
```

---

## Backend — `event-backend`

**Stack:** Node.js · Express · TypeScript · Prisma · PostgreSQL · JWT · Google OAuth · Twilio

### Requirements

- Node.js ≥ 18
- PostgreSQL database
- A `.env` file (see below)

### Environment Variables

Create a `.env` file inside `event-backend/`:

```env
PORT=3000
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
DATABASE_URL=postgresql://user:password@localhost:5432/your_db
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
```

### Setup & Start

```bash
cd event-backend

# Install dependencies
npm install

# Push database schema
npx prisma db push

# Start development server
npm run dev

# OR build and start for production
npm run build
npm start
```

The backend runs on **http://localhost:3000** by default.

---

## Frontend — `frondend`

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · shadcn/ui

### Setup & Start

```bash
cd frondend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on **http://localhost:3001** by default.

> Make sure the backend is running before starting the frontend.

---

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for a full reference of all available endpoints.
