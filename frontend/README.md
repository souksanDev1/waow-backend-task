# WAOW Frontend

Next.js App Router client for the Waow Online authentication API.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui + Lucide
- TanStack Query
- Axios (`src/lib/api/client.ts`)
- React Hook Form + Zod
- Package manager: pnpm

## Setup

```bash
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev
```

App: `http://localhost:3001`  
API: `http://localhost:3000` (start from `backend/` first)

`.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Dev server on port 3001 |
| `pnpm lint` | ESLint |
| `pnpm build` | Production build |
| `pnpm start` | Production server on port 3001 |

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Enter / choose login or register |
| `/login` | Request OTP and sign in |
| `/register` | Request OTP and create a user |
| `/dashboard` | Signed-in home |
| `/profile` | View / update name and profile image |

OTP is a demo code returned by the API. It expires in 1 minute.
