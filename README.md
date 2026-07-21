# Tasks

- **Backend:** NestJS + Prisma + SQLite (`backend/`)
- **Frontend:** Next.js + Tailwind + shadcn/ui on Base UI (`frontend/`)

## Install

```bash
pnpm install
```

Then set up env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Then run the database migrations (creates `dev.db`):

```bash
pnpm migrate
```

## Run

```bash
pnpm dev
```

Starts backend (`http://localhost:3001/api`) and frontend (`http://localhost:3000`) together via `concurrently`.

To run just one:

```bash
pnpm dev:backend
pnpm dev:frontend
```

## Project structure

```
.
├── backend/     NestJS API, Prisma schema + migrations, SQLite
│   └── src/
│       ├── tasks/    controller, service, DTOs
│       └── prisma/   PrismaService (driver adapter)
├── frontend/    Next.js app
│   └── src/
│       ├── app/          pages
│       ├── components/   ui/ (shadcn-style) and tasks/ (feature components)
│       ├── hooks/        useTasks (data + filters)
│       └── lib/          api client, types, utils
├── pnpm-workspace.yaml
└── package.json  root scripts (dev, build, migrate)
```

## Other commands

```bash
pnpm build              # build both apps
pnpm --filter backend test:e2e
```

## Deploying

- **Backend** - Render (`render.yaml` included; persistent disk for the SQLite file)
- **Frontend** - Vercel (root directory `frontend`; Vercel auto-detects the pnpm workspace from the root `pnpm-lock.yaml`). Set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
