# PulseBoard

A MERN-stack analytics/admin dashboard: authenticated users manage projects
and see live stats, an activity chart, and status breakdowns derived from
their own data. Design reference: the "Glass SaaS Dashboard" Figma
community kit (glassmorphism, light/dark theme, purple accent).

## Tech stack

**Client:** React 18, Vite 5, TypeScript, Tailwind CSS, React Router,
Recharts, lucide-react (icons).
**Server:** Node.js, Express, TypeScript, MongoDB + Mongoose, JWT (httpOnly
cookie), bcryptjs, dotenv, CORS, cookie-parser.

## Folder structure

```
pulseboard/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          Button, Card/GlassCard, Input, Textarea, Badge,
│   │   │   │                Skeleton, EmptyState, ErrorState, ConfirmDialog,
│   │   │   │                ThemeToggle, Container
│   │   │   ├── auth/        ProtectedRoute
│   │   │   ├── layout/      Sidebar, Topbar, DashboardShell, MobileDrawer
│   │   │   ├── dashboard/   StatCardsRow, ClientSegmentation, FeatureUsage,
│   │   │   │                CustomerSatisfaction, ConversionFunnel, SalesCycle,
│   │   │   │                SupportTickets, RecentActivityTable,
│   │   │   │                UpcomingDeadlines, AIInsightsPanel
│   │   │   ├── charts/      RevenueChart (Recharts ComposedChart)
│   │   │   └── projects/    ProjectFormModal, ProjectListItem
│   │   ├── pages/           Landing, Login, Register, Dashboard, Projects
│   │   ├── context/         AuthContext, ThemeContext
│   │   ├── hooks/           useAuth, useTheme, useProjects, useDashboardSummary,
│   │   │                    useDrawer, useMediaQuery
│   │   ├── services/        api.ts (fetch wrapper), auth.ts, projects.ts, dashboard.ts
│   │   ├── data/            mockDashboardData.ts (isolated demo data — see below)
│   │   ├── types/           shared TS types matching the API contract
│   │   ├── App.tsx, main.tsx, index.css
│   ├── tailwind.config.ts, vite.config.ts, package.json
├── server/
│   └── src/
│       ├── config/          db.ts (Mongoose connection), env.ts (startup validation)
│       ├── models/          User.ts, Project.ts
│       ├── middleware/      auth.ts (JWT verify), errorHandler.ts, notFound.ts
│       ├── controllers/     authController.ts, projectController.ts, dashboardController.ts
│       ├── services/        authService.ts, projectService.ts, dashboardService.ts
│       ├── routes/          authRoutes.ts, projectRoutes.ts, dashboardRoutes.ts
│       ├── utils/           ApiError.ts, asyncHandler.ts, jwt.ts
│       ├── app.ts           Express app factory (CORS, cookies, routes)
│       └── server.ts        entry point (env validation, DB connect, listen)
├── .gitignore
├── .env.example
└── README.md
```

## Local setup

Requires Node.js ≥ 18 and a MongoDB connection string (local `mongod` or a
free MongoDB Atlas M0 cluster).

```bash
git clone <repo-url>
cd pulseboard
```

**Server:**
```bash
cd server
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET (see below)
npm install
npm run dev                # tsx watch -> http://localhost:5000
```

**Client** (separate terminal):
```bash
cd client
cp .env.example .env      # defaults to http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

### MongoDB setup

Either:
- **Local:** install MongoDB Community Edition, run `mongod`, use
  `MONGO_URI=mongodb://localhost:27017/pulseboard`.
- **Atlas (recommended, free tier):** create an M0 cluster, add a database
  user, add `0.0.0.0/0` to Network Access (fine for a take-home, not for
  real production), and use the provided `mongodb+srv://...` string.

### Troubleshooting: `querySrv ECONNREFUSED` on Windows

Some Windows networks hit a specific issue with `mongodb+srv://` URIs:
Node's own DNS resolver fails to resolve the Atlas `_mongodb._tcp.<cluster>`
SRV record with `querySrv ECONNREFUSED`, even though `nslookup` succeeds for
the exact same record. This is a Node-vs-OS-resolver mismatch, not a
problem with your Atlas cluster, credentials, or Network Access settings.

If you hit this, add one line to `server/.env`:
```
MONGO_SRV_DNS_WORKAROUND=true
```
This points Node's internal DNS resolver at Google's public DNS
(8.8.8.8/8.8.4.4) for this process only — it doesn't touch your Windows
network settings, the OS resolver, or any other application. It's
hard-disabled whenever `NODE_ENV=production` regardless of this setting,
and does nothing at all unless you opt in. See the comment above
`applyDevDnsWorkaroundIfEnabled()` in `server/src/config/db.ts` for the
full reasoning.

## Environment variables

**`server/.env`**

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens — never commit a real value |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | API port (default `5000`) |
| `CLIENT_URL` | Exact frontend origin for CORS — no wildcards, required for cookies to work |
| `NODE_ENV` | `development` or `production` — controls cookie `secure`/`sameSite` |
| `MONGO_SRV_DNS_WORKAROUND` | Optional, dev-only — see Troubleshooting above. Default `false`. |

`MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` are validated at startup
(`server/src/config/env.ts`) — the server refuses to start with a clear
error message if any are missing, rather than degrading silently (this
matters most for `CLIENT_URL`: the `cors` package's default behavior for a
missing `origin` is permissive, which would quietly defeat the "no
wildcard with credentials" requirement).

**`client/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base API URL, e.g. `http://localhost:5000/api` (no hardcoded fallback in code) |

## Scripts

**`server/package.json`:** `npm run dev` (tsx watch), `npm run build`
(`tsc` → `dist/`), `npm start` (`node dist/server.js`), `npm run typecheck`.

**`client/package.json`:** `npm run dev` (Vite), `npm run build`
(`tsc -b && vite build`), `npm run preview`, `npm run typecheck`.

## Authentication approach

JWT stored in an **httpOnly cookie**, not localStorage — chosen so the
token is never reachable from JS (mitigates XSS token theft) at the cost
of needing CORS `credentials: true` + an exact `CLIENT_URL` instead of a
wildcard. Passwords are hashed with bcryptjs (never stored or returned in
plaintext — enforced at the schema level via `select: false` + a `toJSON`
transform, not just by controller discipline). `GET /api/auth/me`
restores the session from the cookie on page refresh. A 401 from *any*
authenticated request (not just the initial session check) flips the
frontend's auth state and redirects to `/login` — covers the
session-expired-mid-use case, not only "never logged in."

## API overview

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Authenticate, set cookie |
| POST | `/api/auth/logout` | Yes | Clear cookie |
| GET | `/api/auth/me` | Yes | Restore session |
| GET | `/api/projects` | Yes | List (paginated, optional `?status=`) |
| POST | `/api/projects` | Yes | Create |
| PATCH | `/api/projects/:id` | Yes | Update |
| DELETE | `/api/projects/:id` | Yes | Delete |
| GET | `/api/dashboard/summary` | Yes | Aggregated stats/chart/status/recent/deadlines |

Every project route derives ownership from the authenticated user
(`req.userId`, set by verifying the JWT) — a project ID alone is never
sufficient; queries are always scoped to `{_id, owner: req.userId}`, and a
cross-user access attempt returns 404 (not 403), so it doesn't even
confirm another user's project exists.

## Architectural decisions / trade-offs

- **Dashboard aggregation is one `$facet` MongoDB pipeline**
  (`server/src/services/dashboardService.ts`), not "fetch all projects,
  reduce in JS." Small further arithmetic (cumulative totals, a naive
  forecast, average completion days) runs only on the pre-aggregated
  result set (≤12 rows), never on the full collection.
- **Five dashboard sections are intentionally mock data, not real API
  data:** Feature Usage, Customer Satisfaction, Conversion Funnel, Sales
  Cycle, Support Tickets. The Figma reference is a generic SaaS-billing
  product; PulseBoard's actual scope (per the FRD) is Users + Projects
  only — there's no subscription, NPS-survey, sales-funnel, or ticketing
  data model to back these honestly. They're clearly isolated in
  `client/src/data/mockDashboardData.ts` and marked in-code in
  `pages/Dashboard.tsx`, rather than either fabricating a data model
  outside the FRD's scope or silently faking numbers as if real.
- **The AI Insights panel is visual-only, by explicit design decision:**
  it matches the Figma reference's layout/hover treatment, but its chat
  input and action buttons are genuinely `disabled` (not just unwired) —
  no message state, no send handler, no AI API, no backend endpoint.
- **RevenueChart's "year" selector reflects reality:** real data is one
  continuous activity series, not split by year, so it shows a plain
  "Last 12 months" label instead of a dropdown with nothing real to
  select.
- **bcryptjs over bcrypt:** pure-JS, no native build step — avoids
  node-gyp failures on free-tier hosts like Render.

## Known limitations

- Built and verified in a sandboxed environment with **no outbound network
  access** — `npm install` was attempted and genuinely fails here (network
  policy blocks the registry: `403 host_not_allowed`), so nothing has been
  through a real `npm install`, a real build, or a real MongoDB connection.
  Everything was verified statically: import-path resolution (checked
  programmatically, not by eye), cross-checking every API endpoint
  path/response shape between frontend services and backend
  controllers/routes line-by-line, and `tsc --noEmit` runs that catch
  genuine syntax/logic errors but can't fully validate against real
  installed type definitions. **Run `npm install` in both `client/` and
  `server/`, then exercise the app in a real browser, before treating this
  as verified.**
- No ESLint configured — `npm run typecheck` is the only static check
  wired up in either package.
- `avgCompletionDays` is computed by the real API but not currently
  displayed (the section that would show it, Sales Cycle, is one of the
  five intentionally-mock sections above).
- No automated test suite (unit/integration/e2e) — out of scope for the
  time available; manual/static verification only.

## Deployment

Free-tier stack: **MongoDB Atlas** (M0) + **Render** (backend, free Web
Service) + **Vercel** (frontend).

1. **Atlas:** create the cluster, allow `0.0.0.0/0` in Network Access, get
   the `mongodb+srv://` connection string.
2. **Render:** New → Web Service → connect the repo → root directory
   `server` → build command `npm install && npm run build` → start command
   `npm start` → set `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`,
   and `CLIENT_URL` (your Vercel URL, once known) as environment variables.
   Free-tier services spin down after 15 min idle — the first request
   after that can take 30–60s.
3. **Vercel:** New Project → import the repo → root directory `client` →
   framework preset Vite → set `VITE_API_URL` to the Render URL + `/api`.
4. Update Render's `CLIENT_URL` to the real Vercel URL once you have it
   (circular dependency between the two — expected, just requires one
   round-trip update).
5. Cookies: `secure: true` and `sameSite: 'none'` only kick in when
   `NODE_ENV=production` (already wired in `authController.ts`) — both
   Render and Vercel serve over HTTPS, so this works without further
   changes once `NODE_ENV` is set correctly.

This hasn't been executed end-to-end in this environment (no network
access) — the above is the intended path, not a confirmed one.
