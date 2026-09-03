# Waow Online

OTP authentication API and Next.js client, split into separate apps.

```
backend/   Node.js + Express + PostgreSQL + Sequelize
frontend/  Next.js App Router (pnpm)
```

## Backend

```bash
cd backend
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run dev
```

API: `http://localhost:3000`  
Postgres: `localhost:5434`

See [backend/README.md](./backend/README.md) for API details.

## Frontend

```bash
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev
```

App: `http://localhost:3001`

See [frontend/README.md](./frontend/README.md) for routes and scripts.
