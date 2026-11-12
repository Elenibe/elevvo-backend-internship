# Task 4: Stateless JWT Authentication & Threat Mitigation

Express + TypeScript service with bcrypt password hashing, JWT login,
role-based access control, Helmet, rate limiting and strict CORS.

## Run
    npm install
    cp .env.example .env   # then set a real JWT_SECRET
    npm run dev

Demo accounts: `admin` / `Admin123!` (ADMIN), `abebe` / `User1234!` (USER)

## Endpoints
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | /api/auth/register | public | Create account (always role USER) |
| POST | /api/auth/login | public, 5 per 15 min | Returns a signed JWT (1h) |
| GET | /api/auth/me | any logged-in user | Current user from token |
| GET | /api/admin/users | ADMIN only | List all users |

## Security features
- Passwords hashed with bcrypt (salted, 10 rounds), never stored in plain text
- JWT signed with HS256, 1h expiry, secret loaded from `.env` (not committed)
- `authenticateToken` (401) and `authorizeRole` (403) middleware
- Same error for wrong username/password; constant-time-style dummy comparison
- Helmet security headers, 100 req/15 min global limit
- Bonus: strict CORS allowlist (`CORS_ORIGINS`), login limited to 5 per 15 min