# Waow Online Backend Task

RESTful user authentication API with JWT and OTP, built with Node.js, Express, PostgreSQL, and Sequelize.

OTP is generated and stored in the database (no SMS provider). The OTP value is returned in the JSON body so the API can be tested locally. The temporary JWT is returned in response headers.

## Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run dev
```

Server defaults to `http://localhost:3000`.

## API

All responses use:

```json
{ "error": false, "code": 0, "message": "Success", "data": {} }
```

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/users/otp` | — | Request OTP (temp JWT in `x-temp-token` and `Authorization`) |
| POST | `/api/users/register` | Temp JWT | Verify OTP and create user |
| POST | `/api/users/login` | Temp JWT | Verify OTP and issue access token |
| GET | `/api/users/profile` | Access JWT | Current user profile |
| PUT | `/api/users/profile` | Access JWT | Update name / profile image |

### Request OTP

```bash
curl -i -X POST http://localhost:3000/api/users/otp \
  -H 'Content-Type: application/json' \
  -d '{"phone_number":"8562056666666"}'
```

Rules:

- OTP expires in 1 minute
- Max 3 wrong OTP attempts (4th attempt returns `OTP_ERR_MAX_ATTEMPT`)
- Max 3 OTP requests per phone number within 1 hour (4th returns `OTP_ERR_MAX_REQUEST`)
- Unknown JSON fields return `VALIDATION_ERR_UNKNOWN_FIELD`

### Register

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer TEMP_JWT" \
  -d '{"otp_code":"123456","name":"John Doe"}'
```

Uses a DB transaction for OTP verification + user creation.

### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer TEMP_JWT" \
  -d '{"otp_code":"123456"}'
```

### Profile

```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer ACCESS_JWT"
```

`phone_number` cannot be updated. Optional profile image upload (`multipart/form-data`, field `profile_image`) is stored in `/uploads` and served publicly.

## Tests

```bash
npm test
```

Tests use an in-memory SQLite database.
