# TrackMyCash Backend Documentation

This documentation covers the backend architecture and implementation standards for TrackMyCash.

## Index

- [Project Structure](./PROJECT-STRUCTURE.md)
- [Backend Architecture Review](./architecture/backend-architecture.md)
- [MongoDB Connection & Schema Design](./architecture/mongodb-connection-and-schemas.md)
- [Auth API Specification](./api/auth-api-spec.md)
- [Validation & Error Handling Standards](./api/validation-and-error-handling.md)

## Current Backend Status

- Authentication backend is implemented.
- Storage is currently file-based (`data/auth-db.json`) via `server/db/auth-file-db.ts` through repository and service layers.
- MongoDB layer is scaffolded by folder structure but not implemented yet.

Use this handbook as the single source of truth while expanding users, reports, transactions, and profile APIs.
