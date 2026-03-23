# Professional Next.js Full-Stack Folder Structure

This project now follows a scalable structure for Next.js App Router + full-stack APIs.

## Top-Level

- `app/` → Routes, layouts, and API route handlers
- `components/` → Reusable UI and shared components
- `features/` → Domain-driven modules (auth, dashboard, transactions, reports)
- `lib/` → Shared helpers (db, auth, http, constants, validations)
- `server/` → Server-only business logic (services, repositories, actions)
- `hooks/` → Reusable React hooks
- `store/` → Global state management
- `contexts/` → React context providers
- `types/` → Shared TypeScript types
- `config/` → App configuration and environment mapping
- `prisma/` → Database schema, migrations, and seed scripts
- `scripts/` → Utility scripts for setup and maintenance
- `tests/` → Unit, integration, and e2e tests
- `docs/` → Architecture and API documentation
- `emails/` → Email templates and related logic

## Routing Layout (`app/`)

- `(marketing)/` → Public pages
- `(auth)/` → Authentication pages
- `(dashboard)/` → Protected app area
- `api/` → Backend endpoints (`auth`, `users`, `transactions`, `reports`, `health`)

## Domain Layout (`features/`)

Each feature can contain:
- `components/`
- `services/`
- `schemas/` or `types/` as needed

This keeps feature code cohesive and avoids a bloated shared layer.
