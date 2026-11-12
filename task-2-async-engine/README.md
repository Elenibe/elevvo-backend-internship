# Task 2: Fault-Tolerant Async Data Engine

TypeScript (strict mode) engine that fetches multiple public APIs concurrently
with `Promise.allSettled()`. Failed endpoints are isolated and logged; the
engine still returns processed data.

## Run
    npm install
    npm start             # default libuv thread pool (4)
    npm run start:pool8   # UV_THREADPOOL_SIZE=8
    npm run typecheck     # strict type check

## Design
- Strict tsconfig (`noImplicitAny`, `strictNullChecks`)
- Raw responses are typed `unknown` and validated with type guards (no `any`)
- Mappers convert raw items into `User`, `Post`, `Todo` domain interfaces
- Two endpoints are intentionally broken (404 + network error) to prove isolation

## Bonus: thread pool comparison (16 PBKDF2 jobs)
| UV_THREADPOOL_SIZE | Time (ms) |
|--------------------|-----------|
| default (4)        | 970       |
| 8                  | 675       |