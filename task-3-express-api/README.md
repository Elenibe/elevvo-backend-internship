# Task 3: Observability & Modular Express API

Express + TypeScript API with Routes / Controllers / Services separation,
global observability middleware, and CRUD on a mock `/api/users` resource.

## Run
    npm install
    npm run dev

## Structure
- routes: map HTTP method + path to a controller
- controllers: validate input, choose status codes, send responses
- services: business logic and (mock) data, with no HTTP knowledge
- middleware: observability logger, API key check, error handling

## Endpoints
| Method | Path | Description | Success |
|--------|------|-------------|---------|
| GET | /health | Health check (public) | 200 |
| GET | /api/users | List users | 200 |
| GET | /api/users/:id | Get one user | 200 / 404 |
| POST | /api/users | Create user | 201 / 400 |
| PUT | /api/users/:id | Update user | 200 / 400 / 404 |
| DELETE | /api/users/:id | Delete user | 204 / 404 |

## Bonus: API key
`/api/users` routes require an `x-api-key` header, otherwise 401 Unauthorized.
Default dev key: `dev-secret-key` (override with the `API_KEY` env variable).