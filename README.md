# TrackMyCash

TrackMyCash is a Next.js full-stack application with App Router, NextAuth-based authentication, and a scalable backend folder design.

## Scripts

- `npm run dev` → start local dev server
- `npm run lint` → run lint checks
- `npm run build` → production build validation
- `npm run start` → run production server

## Environment Setup

Create `.env.local` using `.env.example` and set:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED`

If using MongoDB, also set:

- `MONGODB_URI`
- `MONGODB_DB`

## Documentation

- Main docs index: `docs/README.md`
- Backend architecture review: `docs/architecture/backend-architecture.md`
- MongoDB connection and schema guide: `docs/architecture/mongodb-connection-and-schemas.md`
- Auth API specification: `docs/api/auth-api-spec.md`
- Validation and error standards: `docs/api/validation-and-error-handling.md`

## Current Backend State

- Auth APIs are implemented under `app/api/auth`.
- Current auth persistence is file-based (`data/auth-db.json`) via `server/db/auth-file-db.ts` with repository/service layers.
- MongoDB integration is documented and ready to be implemented in the scaffolded `lib/db` and `server/repositories` layers.
