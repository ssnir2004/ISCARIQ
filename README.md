# ISCARIQ

RFQ → R&D Project → Order → Production Order pipeline tracker, plus an Insert
Advisor for recommending Iscar inserts by operation type, workpiece material,
and cutting problem.

## Stack

- `server/` — Express + TypeScript + Prisma (PostgreSQL)
- `web/` — React + TypeScript + Vite + Tailwind

## First-time setup

```bash
npm install
cp server/.env.example server/.env   # adjust JWT_SECRET / admin credentials
npm run db:up                        # starts Postgres via docker compose
npm run db:migrate                   # creates tables
npm run db:seed                      # seeds branches, R&D teams, ISO 513 materials, problem tags, admin user
```

Seeded admin login (change the password after first login, or set
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `server/.env` before seeding):

- email: `nirc@iscar.co.il`
- password: `changeme123`

## Run

```bash
npm run dev
```

- API: http://localhost:4000
- Web app: http://localhost:5173 (proxies `/api` to the backend)

## Data model

- **Pipeline**: `Rfq` (6-digit number) → `Project` (7-digit number, assigned
  to an R&D `Team`/`Department`) → `Drawing`(s) → `Order` (once the customer
  signs) → `ProductionOrder` (7-digit number, once the production package is
  ready).
- **Insert Advisor**: `Material` (ISO 513 groups P/M/K/N/S/H), `Insert`
  (shape/size/chipbreaker/grade), `CuttingCondition` (per insert+material+
  operation: ap/vc/feed ranges + coolant), `ProblemTag` + `InsertProblemMatch`
  (which inserts solve which cutting problems). The Advisor page queries these
  to rank inserts for a chosen operation, material, and set of problems.

Team/department reference data seeded in `server/prisma/seed.ts` reflects the
current R&D team-code list — edit there (or via the Teams & Departments page)
as codes change.
