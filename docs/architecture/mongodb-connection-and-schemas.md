# MongoDB Connection & Schema Design Guide

This guide defines how MongoDB should be integrated in TrackMyCash with your current structure.

## 1) Environment Variables

Add to `.env.local`:

- `MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbName>?retryWrites=true&w=majority`
- `MONGODB_DB=trackmycash`

Existing auth variables remain required:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 2) Connection Placement

Create connection utility in: `lib/db/mongodb.ts`

Responsibilities:
- Open a singleton Mongo client
- Reuse client between requests in development and production
- Expose `getDb()` helper returning selected database instance

Suggested pattern:

```ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "trackmycash";

if (!uri) throw new Error("Missing MONGODB_URI");

let clientPromise: Promise<MongoClient>;

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalForMongo._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalForMongo._mongoClientPromise = client.connect();
}

clientPromise = globalForMongo._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
```

## 3) Collections and Schema Contracts

### `users` collection

Required fields:
- `_id`
- `fullName: string`
- `email: string` (unique, lowercase)
- `country: string`
- `passwordHash: string`
- `emailVerified: boolean`
- `provider: "credentials" | "google"`
- `createdAt: Date`
- `updatedAt: Date`

Indexes:
- unique index on `email`

### `otp_tokens` collection

Required fields:
- `_id`
- `email: string`
- `purpose: "forgot-password"`
- `codeHash: string` (never store plain OTP in production)
- `expiresAt: Date`
- `createdAt: Date`

Indexes:
- index on `email`
- TTL index on `expiresAt`

## 4) Validation Mapping (Zod ↔ MongoDB)

- Keep input validation in Zod schemas under `lib/validations`
- Normalize `email` to lowercase before DB query
- Hash passwords and OTP values before persistence
- Reject unknown payload keys (`schema.strict()`)

## 5) Repository Placement

- `server/repositories/user-repository.ts`
- `server/repositories/otp-repository.ts`

Repository examples:
- `findUserByEmail(email)`
- `createUser(payload)`
- `updatePassword(email, passwordHash)`
- `createOtpToken(email, purpose, codeHash, expiresAt)`
- `consumeValidOtp(email, purpose, otp)`

## 6) Migration from Current File Store

Current source: `data/auth-db.json` used by `server/db/auth-file-db.ts` through `server/repositories/auth-repository.ts` and `server/services/auth-service.ts`

Migration plan:
1. Export users/otp from JSON
2. Insert users into `users`
3. Insert active OTP entries into `otp_tokens`
4. Replace file-db repository calls with MongoDB repository calls
5. Keep same API response contracts to avoid frontend changes

## 7) Security Requirements

- Never return OTP in production responses
- Never store plain OTP in DB
- Keep password hash rounds strong (`bcryptjs`, cost 12+)
- Add request rate limiting on forgot-password and login
- Add account lockout strategy after repeated failed logins
