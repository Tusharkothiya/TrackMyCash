# Validation & Error Handling Standards

This standard should be applied to all new API modules (`users`, `transactions`, `reports`, `profile`).

## 1) Validation Strategy

- Define input schemas in `lib/validations/<feature>.ts`
- Import schemas into route handlers and services
- Use `safeParse` and return first user-facing message for client UX
- Use `schema.strict()` for write endpoints to block unknown fields

## 2) Suggested Validation Files

- `lib/validations/auth.ts`
- `lib/validations/user.ts`
- `lib/validations/transaction.ts`
- `lib/validations/report.ts`

## 3) Error Categories

### Client errors (4xx)
- 400: invalid payload / schema mismatch
- 401: unauthorized
- 403: forbidden
- 404: resource not found
- 409: conflict (duplicate data)
- 422: semantic rule violation

### Server errors (5xx)
- 500: unknown internal error
- 503: temporary dependency/service outage

## 4) Error Response Format

Use a consistent envelope:

```json
{
  "success": false,
  "message": "Human-readable message",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 5) Mapping Zod Errors

- Convert Zod issues into `{ field, message }` array
- Return first message for simple form UIs
- Preserve full array in `errors` for advanced clients

## 6) Logging Guidance

- Log operational errors with context (route, user id, correlation id)
- Never log plain passwords, OTP, or secrets
- In production, sanitize DB and auth stack traces from response body

## 7) Security Validation Checklist

- Normalize and trim email values
- Password minimum length and entropy checks
- Enforce OTP length and expiration
- Verify session before mutation endpoints
- Add rate-limiting on auth-sensitive endpoints
- Keep secrets in environment variables only

## 8) API Growth Pattern

For each new API module:

1. Create `app/api/<module>/route.ts`
2. Create `lib/validations/<module>.ts`
3. Create `server/services/<module>-service.ts`
4. Create `server/repositories/<module>-repository.ts`
5. Add API spec under `docs/api/<module>-api-spec.md`

This keeps backend growth predictable and review-friendly.
