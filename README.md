# TalentDash — Compensation Intelligence MVP

A production-grade, statically-optimized compensation intelligence platform built on Next.js 15, Prisma 7, and Neon PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| ORM | Prisma 7 (`@prisma/adapter-pg`) |
| Database | Neon PostgreSQL (serverless) |
| Styling | Tailwind CSS v4 (no component libraries) |
| Validation | Zod |

---

## Local Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd talentdash-trial
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&uselibpqcompat=true"
```

> **Where to get these values:** Log in to [Neon Console](https://console.neon.tech), select your project, and copy the connection string from the **Connection Details** panel. Use the **Pooled connection** string.

> **⚠️ Important:** The `uselibpqcompat=true` parameter is required to suppress SSL mode warnings from `pg` v8.

### 3. Run Database Migrations

Apply the schema migration to your database:

```bash
npx prisma migrate deploy
```

### 4. Seed the Database

Populate 50 realistic salary records across Google, Meta, Amazon, NVIDIA, TCS, Infosys, Uber, Atlassian:

```bash
npx prisma db seed
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## API Routes

All API routes return `application/json`. The reviewer can test these directly.

### `POST /api/ingest-salary`

Ingest a new compensation record. Validates with Zod, normalizes company name, maps level to L3–L8 standard band.

**Request body:**
```json
{
  "company": "Stripe",
  "role": "Backend Engineer",
  "level": "L5",
  "location": "Remote",
  "experience_years": 5,
  "base_salary": 180000,
  "bonus": 20000,
  "stock": 50000
}
```

**Success (201):**
```json
{ "data": { "id": "...", "total_compensation": 250000, ... } }
```

**Validation error (400):**
```json
{ "error": "Invalid payload", "issues": [...] }
```

---

### `GET /api/salaries`

Fetch paginated salary records with optional filters.

**Query params:** `company`, `role`, `level` (L3–L8), `location`, `page`, `limit`, `sort` (`total_compensation`), `order` (`asc`/`desc`)

**Example:** `GET /api/salaries?level=L5&location=Remote&page=1&limit=10`

**Response:**
```json
{
  "data": [...],
  "meta": { "total": 12, "page": 1, "limit": 10, "totalPages": 2 }
}
```

Cache-Control: `public, s-maxage=60, stale-while-revalidate=300`

---

### `GET /api/companies/[slug]`

Get salary data, median TC, and level distribution for a specific company.

**Example:** `GET /api/companies/google`

**Response:**
```json
{
  "company": "Google",
  "normalized_company": "google",
  "totalRecords": 8,
  "medianTc": 320000,
  "levelDistribution": { "L4": 2, "L5": 3, "L6": 2, "L7": 1 },
  "salaries": [...]
}
```

Cache-Control: `public, s-maxage=300, stale-while-revalidate=600`

---

## Rendering Strategy & Trade-offs

| Route | Strategy | Rationale |
|---|---|---|
| `/` | **Static** | No dynamic data read at request time — 0ms loads |
| `/companies/[slug]` | **SSG** via `generateStaticParams` | Pre-renders all known company pages at build time. Fast CDN cache hits. Reviewer should note the `●` markers in build output. |
| `/salaries` | **Dynamic Server Rendering** | Reads `searchParams` for level/location/role filters. Opts into dynamic rendering to provide SEO-friendly filtered URLs. Each render fetches fresh data via `/api/salaries`. |
| `/api/salaries` | **Dynamic with CDN cache** | `s-maxage=60` allows CDN to serve cached responses while `stale-while-revalidate` prevents cold cache misses. |
| `/api/companies/[slug]` | **Dynamic with CDN cache** | `s-maxage=300` for company profiles which change less frequently. |

---

## Data Flow

```
Prisma seed → Neon DB → API routes → RSC pages → Browser
```

No hardcoded arrays. No mocked data. Every rendered value originates from the database.

---

## Deployment (Vercel)

1. Push to GitHub.
2. Import repo in [Vercel Dashboard](https://vercel.com/new).
3. Add environment variable: `DATABASE_URL` (your Neon pooled connection string with `uselibpqcompat=true`).
4. Set Build Command: `npx prisma generate && next build`
5. Deploy. Vercel will run `generateStaticParams` and pre-render all company pages against your live Neon database.

> **After first deploy:** Run `npx prisma migrate deploy` from your local machine pointed at the production DB to apply any future schema migrations.
