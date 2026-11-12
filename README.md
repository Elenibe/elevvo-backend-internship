# Task 1: Web Request Inspector & Raw HTTP Server

A server built with Node's built-in `http` module only (no frameworks).

## Run
    node server.js

## Endpoints
| Method | Path | Response |
|--------|------|----------|
| GET | / | Welcome message (200) |
| GET | /api/users | List of mock users (200) |
| GET | /api/health | Uptime, OS platform, ISO timestamp (200) |
| any | other | JSON error (404) |