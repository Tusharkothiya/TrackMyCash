# Auth API Specification

This document describes current auth endpoints in TrackMyCash.

## Base

- Local base URL: `http://localhost:3000`
- Content type: `application/json`

## 1) Register

### Endpoint
`POST /api/auth/register`

### Request body
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "strongPass123",
  "confirmPassword": "strongPass123",
  "country": "India"
}
```

### Validation rules
- `fullName`: min 2 chars
- `email`: valid email
- `password`: min 8 chars
- `confirmPassword`: min 8 chars and must match `password`
- `country`: min 2 chars

### Responses
- `200`: registration success
- `400`: validation error
- `409`: duplicate email
- `500`: server error

## 2) Forgot Password

### Endpoint
`POST /api/auth/forgot-password`

### Request body
```json
{ "email": "john@example.com" }
```

### Validation rules
- `email`: valid email

### Responses
- `200`: generic success, or OTP generated success
- `400`: validation error
- `500`: server error

Notes:
- In non-production, OTP may be returned for developer testing.
- In production, OTP must not be returned.

## 3) Verify OTP

### Endpoint
`POST /api/auth/verify-otp`

### Request body
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Validation rules
- `email`: valid email
- `otp`: exactly 6 chars

### Responses
- `200`: OTP verified
- `400`: invalid input / invalid or expired OTP
- `500`: server error

## 4) Change Password

### Endpoint
`POST /api/auth/change-password`

### Auth
- Requires active NextAuth session

### Request body
```json
{
  "oldPassword": "oldPass123",
  "newPassword": "newPass123",
  "confirmPassword": "newPass123"
}
```

### Validation rules
- all password fields min 8 chars
- `newPassword` must equal `confirmPassword`

### Responses
- `200`: password updated
- `400`: validation failed / old password mismatch
- `401`: unauthorized
- `500`: server error

## 5) NextAuth Handler

### Endpoint
`GET/POST /api/auth/[...nextauth]`

### Providers configured
- Credentials provider
- Google provider (enabled when env keys are set)

## Response Envelope Convention

Current routes return:

```json
{
  "success": true,
  "message": "..."
}
```

Recommended extension for future APIs:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {}
}
```
