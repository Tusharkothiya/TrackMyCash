# Backend Architecture Review (TrackMyCash)

## 1) Current Implemented Backend

### Runtime stack
- Next.js App Router route handlers (`app/api/**/route.ts`)
- NextAuth for authentication (`app/api/auth/[...nextauth]/route.ts`, `lib/auth/options.ts`)
- Zod input validation inside API handlers
- `bcryptjs` for password hashing and verification

### Implemented API modules
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/change-password`
- NextAuth handlers (`GET/POST /api/auth/[...nextauth]`)

### Current data source
- `server/db/auth-file-db.ts` manages reads/writes of `data/auth-db.json`.
- `server/repositories/auth-repository.ts` handles persistence access.
- `server/services/auth-service.ts` contains auth business logic.
- OTP is stored in memory/file object map with 10-minute expiry.

## 2) Folder Responsibilities (Backend)

- `app/api/` → API entrypoints and HTTP concerns only
- `lib/auth/` → auth configuration (`authOptions`), providers, callbacks
- `lib/db/` → database connection clients (MongoDB client should live here)
- `lib/validations/` → reusable Zod schemas shared across routes
- `server/services/` → business logic and workflows
- `server/repositories/` → persistence layer (MongoDB queries)
- `server/middleware/` → shared guards/rate-limit logic (future)
- `types/` → cross-layer TypeScript contracts

## 3) Request Flow Standard

1. Route handler receives request (`app/api/.../route.ts`)
2. Parse + validate payload with Zod
3. Authorize (if needed) using NextAuth session
4. Call service in `server/services`
5. Service calls repository in `server/repositories`
6. Repository executes MongoDB operation through `lib/db`
7. Route returns normalized JSON response

## 4) Architecture Gaps Identified

Current code is production-valid but has these temporary gaps:

- Data storage is JSON file based (not horizontally scalable)
- Validation schemas are duplicated in route files
- Repository layer is scaffolded but not active
- `users`, `reports`, `transactions`, `health` API folders are scaffolded but not implemented

## 5) Recommended Target Design

- Keep routes thin; move logic to services
- Keep DB logic only in repositories
- Centralize validation in `lib/validations/*`
- Use a shared API response helper for consistent success/error payloads
- Add audit fields (`createdAt`, `updatedAt`) in all MongoDB collections
