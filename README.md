# StackCRM — AI-Powered CRM Platform

A full-stack, production-ready Customer Relationship Management system built with **Node.js**, **Express**, **MongoDB**, and **React**. Designed with industry-grade architecture including role-based access control, audit logging, analytics, and a modern dark-themed UI.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
  - [Entry Point](#entry-point)
  - [Modules](#modules)
  - [Middlewares](#middlewares)
  - [Utils](#utils)
  - [Constants](#constants)
  - [Config](#config)
  - [Database](#database)
- [API Reference](#api-reference)
- [Role-Based Access Control](#role-based-access-control)
- [Frontend Architecture](#frontend-architecture)
  - [Pages](#pages)
  - [Components](#components)
  - [Context & State](#context--state)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Overview

StackCRM is a full-featured CRM backend and frontend built to manage the complete sales lifecycle:

- **Organisations** — companies your team works with
- **Leads** — potential customers moving through a sales funnel
- **Deals** — revenue opportunities linked to leads
- **Tasks** — action items assigned to team members
- **Users** — team management with role-based permissions
- **Activity Log** — full audit trail of every write operation
- **Analytics** — dashboard metrics, pipeline value, agent performance

---

## Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| Express | 5.x | HTTP server and routing |
| Mongoose | 9.x | MongoDB ODM |
| jsonwebtoken | 9.x | JWT access token generation and verification |
| bcryptjs | 3.x | Password hashing |
| Joi | 18.x | Request body validation |
| helmet | 8.x | HTTP security headers |
| cors | 2.x | Cross-origin resource sharing |
| express-rate-limit | 8.x | Brute force and DoS protection |
| cookie-parser | 1.x | Cookie parsing middleware |
| dotenv | 17.x | Environment variable loading |
| nodemon | 3.x | Development auto-restart |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | 19.x | UI library |
| React Router DOM | 7.x | Client-side routing |
| Axios | 1.x | HTTP client with interceptors |
| Recharts | 3.x | Charts and data visualisation |
| Lucide React | 1.x | Icon library |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Vite | 8.x | Build tool and dev server |

---

## Project Structure

```
Stackforge/
├── backend/
│   ├── index.js                    # Server entry point
│   ├── env/
│   │   ├── .env                    # Environment variables (gitignored)
│   │   └── .env.example            # Template for required variables
│   └── src/
│       ├── app.js                  # Express app setup, middleware, routes
│       ├── config/
│       │   └── jwt.config.js       # JWT secret and expiry config
│       ├── constants/
│       │   ├── roles.js            # Role name constants
│       │   ├── permissions.js      # Role → permission matrix
│       │   ├── messages.js         # All response message strings
│       │   └── status.js           # HTTP status codes + account states
│       ├── database/
│       │   └── mongo.js            # MongoDB connection
│       ├── middlewares/
│       │   ├── auth.middlware.js   # JWT verification → req.user
│       │   ├── role.middleware.js  # RBAC: authorize() and requirePermission()
│       │   ├── validate.middleware.js  # Joi schema validation factory
│       │   ├── validateId.middleware.js # MongoDB ObjectId format check
│       │   ├── logActivity.middleware.js # Auto audit log on writes
│       │   ├── rateLimit.middleware.js   # Global + auth rate limiters
│       │   └── error.middleware.js       # Centralised error handler
│       ├── modules/
│       │   ├── auth/               # Authentication module
│       │   ├── users/              # User management module
│       │   ├── orgs/               # Organisations module
│       │   ├── leads/              # Leads module
│       │   ├── deals/              # Deals module
│       │   ├── tasks/              # Tasks module
│       │   ├── activity/           # Audit log module
│       │   └── analytics/          # Dashboard analytics module
│       └── utils/
│           ├── AppError.js         # Custom operational error class
│           ├── asyncHandler.js     # Async controller wrapper
│           ├── response.js         # Standardised response helpers
│           └── logger.js           # Structured console logger
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx                # React entry point
        ├── App.jsx                 # Router and route definitions
        ├── index.css               # Tailwind base + global styles
        ├── lib/
        │   └── api.js              # Axios instance with JWT interceptor
        ├── context/
        │   └── AuthContext.jsx     # Auth state (login/logout/user)
        ├── components/
        │   ├── layout/
        │   │   ├── Layout.jsx      # Sidebar + main content wrapper
        │   │   ├── Sidebar.jsx     # Navigation sidebar with gradient
        │   │   └── PageHeader.jsx  # Reusable page title + action slot
        │   └── ui/
        │       ├── Badge.jsx       # Color-coded status/role chips
        │       ├── Button.jsx      # Primary, ghost, danger variants
        │       ├── Card.jsx        # Dark surface container
        │       ├── Input.jsx       # Labeled input with error state
        │       ├── Select.jsx      # Labeled select dropdown
        │       ├── Modal.jsx       # Overlay dialog with backdrop
        │       ├── Table.jsx       # Data table with hover rows
        │       ├── SearchBar.jsx   # Search input with icon
        │       └── Pagination.jsx  # Page navigation with count
        └── pages/
            ├── Login.jsx           # Sign in / Register page
            ├── Dashboard.jsx       # Analytics overview + charts
            ├── Leads.jsx           # Lead list with filters + create
            ├── Deals.jsx           # Deal pipeline with filters + create
            ├── Tasks.jsx           # Task list with filters + create
            ├── Orgs.jsx            # Organisation card grid + create
            └── Users.jsx           # User list with role filter
```

---

## Backend Architecture

### Entry Point

**`index.js`** — Loads environment variables first (before any imports), connects to MongoDB, then starts the Express server on the configured port.

**`src/app.js`** — Configures the Express application:
- Security headers via `helmet`
- CORS allowing localhost:5173–5175 (Vite dev ports)
- JSON body parsing and cookie parsing
- Global rate limiter (100 req/15min) + strict auth limiter (10 req/15min)
- All route registrations under `/api/v1/`
- 404 handler and global error handler

---

### Modules

Each module follows the same 3-file structure: **model → controller → routes**

#### `auth/`
Handles user registration, login, logout, and current user retrieval.

| File | What it does |
|---|---|
| `auth.controller.js` | Register (bcrypt hash via pre-save hook), login (compare password, issue JWT), logout (client-side), getMe |
| `auth.token.js` | `signAccessToken()` and `verifyAccessToken()` using jsonwebtoken |
| `auth.validation.js` | Joi schemas for register and login request bodies |
| `auth.routes.js` | Public: POST /register, POST /login. Protected: POST /logout, GET /me |

#### `users/`
Team member management. Admins and managers can list users. Only admins can deactivate accounts.

| File | What it does |
|---|---|
| `user.model.js` | Mongoose schema with bcrypt pre-save hook, `comparePassword()`, `toSafeObject()` (strips password) |
| `user.controller.js` | List (with search/role/status filters), getOne, update (name/role only), deactivate |
| `user.validator.js` | Joi schema — only name and role are updatable |
| `user.routes.js` | GET /, GET /:id, PATCH /:id, PATCH /:id/deactivate |

#### `orgs/`
Company/organisation management. Agents can read, managers can write, only admins can delete.

| File | What it does |
|---|---|
| `org.model.js` | Fields: name (unique), industry, website, phone, isDeleted, createdBy, timestamps. Indexes on name, isDeleted+createdAt, industry |
| `org.controller.js` | Full CRUD with soft delete, search by name/industry, sort support |
| `org.validator.js` | Joi schemas with max length limits |
| `org.routes.js` | Standard REST routes with permission middleware |

#### `leads/`
Lead lifecycle management. Auto-assigns `assignedTo` to the creating user on POST.

| File | What it does |
|---|---|
| `lead.model.js` | Fields: name, email, phone, status (new/contacted/qualified/lost/converted), source (manual/web/referral/import), organisation ref, assignedTo ref, isDeleted. 5 indexes |
| `lead.controller.js` | CRUD with filters: search, status, source, assignedTo (supports "me"), organisation, dateFrom/dateTo, sort/order |
| `lead.validator.js` | Joi schemas with email validation and enum constraints |
| `lead.routes.js` | Standard REST with logActivity middleware on writes |

#### `deals/`
Deal pipeline management. Pre-save hook sets `closedAt` when stage becomes won or lost.

| File | What it does |
|---|---|
| `deal.model.js` | Fields: title, value, stage (prospecting/proposal/negotiation/won/lost), lead ref, assignedTo ref, closedAt, isDeleted. Pre-save hook for closedAt |
| `deal.controller.js` | CRUD with filters: search, stage, assignedTo, minValue/maxValue, dateFrom/dateTo |
| `deal.validator.js` | Joi schemas requiring title, value, and lead |
| `deal.routes.js` | Standard REST with logActivity on writes |

#### `tasks/`
Task assignment and tracking. Supports filtering by `assignedTo=me`.

| File | What it does |
|---|---|
| `task.model.js` | Fields: title, dueDate, priority (low/medium/high), status (open/in_progress/done), assignedTo ref, lead ref, deal ref, isDeleted. 6 indexes including dueDate for reminder queries |
| `task.controller.js` | CRUD with filters: search, status, priority, assignedTo, dueBefore/dueAfter |
| `task.validator.js` | Joi schemas requiring title and dueDate |
| `task.routes.js` | Standard REST with logActivity on writes |

#### `activity/`
Automatic audit trail. Every POST, PATCH, DELETE on any resource creates an activity log entry.

| File | What it does |
|---|---|
| `activity.model.js` | Fields: user (ref), userName (denormalized), action (created/updated/deleted), resource, resourceId, changes (for updates). 3 indexes |
| `activity.controller.js` | List with filters: resource, resourceId, userId. Paginated |
| `activity.routes.js` | GET / — admin and manager only |

#### `analytics/`
MongoDB aggregation pipelines for dashboard metrics. Admin and manager only.

| File | What it does |
|---|---|
| `analytics.controller.js` | 5 endpoints: summary (totals), leadStats (funnel by status), dealStats (pipeline by stage + won revenue), taskStats (breakdown + overdue count), agentStats (per-agent open leads/deals/overdue tasks) |
| `analytics.routes.js` | GET /summary, /leads, /deals, /tasks, /agents |

---

### Middlewares

| File | Purpose |
|---|---|
| `auth.middlware.js` | Reads `Authorization: Bearer <token>`, verifies JWT, attaches `{ sub, role }` to `req.user` |
| `role.middleware.js` | `authorize(...roles)` — checks role. `requirePermission(resource, action)` — checks permission matrix |
| `validate.middleware.js` | Factory: takes a Joi schema, validates `req.body`, strips unknown fields, replaces body with sanitised values |
| `validateId.middleware.js` | Checks `req.params.id` is a valid MongoDB ObjectId before hitting the DB |
| `logActivity.middleware.js` | Hooks into `res.json` after a successful write response to create an Activity document |
| `rateLimit.middleware.js` | `globalLimiter` (100/15min), `authLimiter` (10/15min for login/register) |
| `error.middleware.js` | Catches all errors: Mongoose duplicate key (409), validation errors (422), CastErrors (400), operational AppErrors, and unknown 500s |

---

### Utils

| File | Purpose |
|---|---|
| `AppError.js` | Custom error class extending Error. Has `statusCode`, `code`, `isOperational`. Operational errors show their message to clients; unknown errors show a generic message |
| `asyncHandler.js` | Wraps async controller functions: `(fn) => (req, res, next) => Promise.resolve(fn(...)).catch(next)`. Eliminates try/catch in every controller |
| `response.js` | Three helpers: `success(res, data, statusCode, message)`, `fail(res, message, statusCode, code)`, `paginate(res, data, total, page, limit)` |
| `logger.js` | Structured logger with `[LEVEL] timestamp | message | meta` format. Replaces raw `console.log` in error middleware |

---

### Constants

| File | Purpose |
|---|---|
| `roles.js` | Exports `ADMIN = 'admin'`, `MANAGER = 'manager'`, `AGENT = 'agent'` |
| `permissions.js` | Maps each role to an array of `resource:action` strings. `can(role, resource, action)` helper returns boolean |
| `messages.js` | All auth error/success strings in one place — no hardcoded strings in controllers |
| `status.js` | HTTP status code constants (200, 201, 400, 401, etc.) and `ACCOUNT_STATUS` (active/inactive) |

---

### Config

**`jwt.config.js`** — Uses getter functions so `process.env` is read at call time (not at import time). Returns `{ access: { secret, expiresIn }, refresh: { secret, expiresIn } }`.

---

### Database

**`mongo.js`** — Connects to MongoDB using `mongoose.connect(process.env.MONGO_URI)`. Logs success or exits the process on failure.

---

## API Reference

All endpoints are prefixed with `/api/v1/`.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/logout` | Bearer | Logout (client discards token) |
| GET | `/auth/me` | Bearer | Get current user |

### Organisations
| Method | Endpoint | Permission | Description |
|---|---|---|---|
| GET | `/orgs` | Any | List with search/industry/sort filters |
| POST | `/orgs` | orgs:write | Create organisation |
| GET | `/orgs/:id` | orgs:read | Get one |
| PATCH | `/orgs/:id` | orgs:write | Update |
| DELETE | `/orgs/:id` | orgs:delete | Soft delete |

### Leads
| Method | Endpoint | Permission | Description |
|---|---|---|---|
| GET | `/leads` | leads:read | List with search/status/source/assignedTo/date filters |
| POST | `/leads` | leads:write | Create (auto-assigns to current user) |
| GET | `/leads/:id` | leads:read | Get one |
| PATCH | `/leads/:id` | leads:write | Update |
| DELETE | `/leads/:id` | leads:delete | Soft delete |

### Deals
| Method | Endpoint | Permission | Description |
|---|---|---|---|
| GET | `/deals` | deals:read | List with search/stage/value range/date filters |
| POST | `/deals` | deals:write | Create |
| GET | `/deals/:id` | deals:read | Get one |
| PATCH | `/deals/:id` | deals:write | Update (sets closedAt if won/lost) |
| DELETE | `/deals/:id` | deals:delete | Soft delete |

### Tasks
| Method | Endpoint | Permission | Description |
|---|---|---|---|
| GET | `/tasks` | tasks:read | List with search/status/priority/assignedTo/due date filters |
| POST | `/tasks` | tasks:write | Create |
| GET | `/tasks/:id` | tasks:read | Get one |
| PATCH | `/tasks/:id` | tasks:write | Update |
| DELETE | `/tasks/:id` | tasks:delete | Soft delete |

### Users
| Method | Endpoint | Permission | Description |
|---|---|---|---|
| GET | `/users` | Admin/Manager | List with search/role/status filters |
| GET | `/users/:id` | Bearer | Get one |
| PATCH | `/users/:id` | Bearer | Update name/role |
| PATCH | `/users/:id/deactivate` | Admin only | Deactivate account |

### Analytics (Admin/Manager only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/summary` | Total counts + won revenue + overdue tasks |
| GET | `/analytics/leads` | Lead count grouped by status |
| GET | `/analytics/deals` | Deal count + value by stage, total won revenue |
| GET | `/analytics/tasks` | Task count by status + overdue count |
| GET | `/analytics/agents` | Per-agent: open leads, open deals, overdue tasks |

### Activity Log (Admin/Manager only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/activity` | Paginated audit log. Filter by resource, resourceId, userId |

---

## Role-Based Access Control

Three roles with granular permissions:

| Permission | Admin | Manager | Agent |
|---|---|---|---|
| users:read | ✅ | ✅ | ❌ |
| users:write | ✅ | ❌ | ❌ |
| users:delete | ✅ | ❌ | ❌ |
| leads:read/write | ✅ | ✅ | ✅ |
| leads:delete | ✅ | ✅ | ❌ |
| deals:read/write | ✅ | ✅ | ✅ |
| deals:delete | ✅ | ✅ | ❌ |
| tasks:read/write | ✅ | ✅ | ✅ |
| tasks:delete | ✅ | ✅ | ❌ |
| orgs:read | ✅ | ✅ | ✅ |
| orgs:write | ✅ | ✅ | ❌ |
| orgs:delete | ✅ | ❌ | ❌ |

---

## Frontend Architecture

### Pages

| Page | Route | Description |
|---|---|---|
| `Login.jsx` | `/login` | Split-panel login/register page with JWT auth |
| `Dashboard.jsx` | `/` | Stat cards, lead funnel bar chart, deal pipeline pie chart, agent performance table |
| `Leads.jsx` | `/leads` | Paginated table with search/status filter and create modal |
| `Deals.jsx` | `/deals` | Paginated table with search/stage filter and create modal |
| `Tasks.jsx` | `/tasks` | Paginated table with search/status/priority/my-tasks filter and create modal |
| `Orgs.jsx` | `/orgs` | Card grid view with search and create modal |
| `Users.jsx` | `/users` | Paginated table with search/role filter |

### Components

**Layout**
- `Layout.jsx` — Wraps every protected page with the sidebar and main content area
- `Sidebar.jsx` — Fixed navigation with gradient background, active link highlighting, user info, and logout
- `PageHeader.jsx` — Reusable title + subtitle + action button slot

**UI Primitives**
- `Badge.jsx` — Color-coded chips for status, role, priority, source values
- `Button.jsx` — Primary (indigo), ghost, danger, success, subtle variants with size options
- `Card.jsx` — Dark surface container with border
- `Input.jsx` — Labeled input with error state and focus ring
- `Select.jsx` — Labeled select with same styling as Input
- `Modal.jsx` — Centered overlay with backdrop blur, ESC key support, click-outside close
- `Table.jsx` — Data table with column renderers, hover rows, empty state
- `SearchBar.jsx` — Search input with search icon
- `Pagination.jsx` — Page navigation with record count and numbered pages

### Context & State

**`AuthContext.jsx`** — React context providing:
- `user` — current user object (persisted in localStorage)
- `token` — JWT access token (persisted in localStorage)
- `login(email, password)` — calls `/auth/login`, stores token and user
- `logout()` — clears localStorage and state
- `isAuth` — boolean for route protection

**`lib/api.js`** — Axios instance configured with:
- `baseURL: http://localhost:5000/api/v1`
- Request interceptor: attaches `Authorization: Bearer <token>` header
- Response interceptor: redirects to `/login` on 401

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Copy the environment template and fill in your values:
```bash
cp env/.env.example env/.env
```

Start the development server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` (or 5174 if port is in use)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_ACCESS_SECRET` | **Yes** | Secret for signing access tokens (min 32 chars) |
| `JWT_ACCESS_EXPIRES` | No | Access token expiry (default: 15m) |
| `CLIENT_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Security Features

- **Password hashing** — bcrypt with salt rounds 12, via Mongoose pre-save hook
- **JWT authentication** — Short-lived access tokens (15 min)
- **RBAC** — Granular `resource:action` permission checks on every route
- **Rate limiting** — 100 req/15min globally, 10 req/15min on auth endpoints
- **Input validation** — Joi schemas on all write endpoints with max length limits
- **ObjectId validation** — Invalid IDs rejected before hitting the database
- **Soft deletes** — Records are never permanently deleted, `isDeleted` flag used
- **Security headers** — helmet middleware on all responses
- **Audit logging** — Every create/update/delete is logged with user attribution
