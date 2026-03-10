# C15 Tour — Project Context

## What is this project?
**C15 Tour** is a REST API backend (NestJS + TypeScript + MySQL/TypeORM) for a **mobile and web app that organizes and guides Citroën C15 vehicle convoys**. School project by Killiane LETELLIER (Pépite student-entrepreneur program).

## Stack
- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: MySQL via TypeORM
- **Auth**: Passport.js (JWT + Local strategy)
- **Docs**: Swagger at `/api`
- **Package manager**: pnpm

## Two user types
1. **Organizer (Admin)** — Authenticated via email + password (JWT). Creates and manages convoy events, plans routes, monitors participants in real time.
2. **Participant** — **NO account needed**. Joins anonymously via an 8-char event share code (e.g. `C15AB7`). Gets GPS guidance, audio stream, notifications.

## Modules & API Routes
| Module | Prefix | Description |
|---|---|---|
| `AuthModule` | `/api/auth` | Admin login, participant join via code, JWT profile |
| `UsersModule` | `/api/users` | CRUD for admin users |
| `EventsModule` | `/api/events` | Event lifecycle (BROUILLON → PLANIFIE → EN_COURS → TERMINE/ANNULE) |
| `RoutesModule` | `/api/routes` | Routes + Points + Segments (waypoints between points) |
| `ParticipationModule` | `/api/participation` | Links participant to event, tracks progress |
| `PositionsModule` | `/api/positions` | Real-time GPS position logs per participation |

## Key Data Model
```
User ──(organizer)──► Event ──(1:1)──► Route ──► Points ──► Segments
                        │
                        └──► Participation ──► RealTimePositions
                                           └──► CorrectionNavigations
                                           └──► Notifications
Event ──► AudioStream (live audio broadcast)
Event ──► EventHistory (post-event archive)
```

## Key Business Rules
- **Super Admin** is seeded on startup from `.env` (`SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`) — no public registration endpoint.
- **Participants** join via `POST /api/auth/participant/join` with `{ code, anonymousId }` — no account required.
- Events have an **8-char unique shareCode** for participants to join.
- **3 point types**: `PASSAGE` (mandatory stop), `INTERET` (info point), `PAUSE` (rest stop with duration).
- **Participation** tracks: current GPS position, progress %, current point, status (`INSCRIT → EN_COURS → TERMINE/ABANDONNE`).
- **CorrectionNavigation**: triggered when participant deviates > X meters from route polyline.

## What is NOT yet implemented (planned)
- WebSockets / Socket.io (real-time positions, notifications, audio)
- Route calculation via mapping API (Mapbox/Google Maps) — `POST /routes/{id}/calculate`
- Automatic shareCode generation logic in EventsService
- Live audio streaming (WebRTC or WebSocket audio chunks)
- GPX/PDF export
- Rate limiting on `/join` and `/positions`
- RGPD: auto-delete anonymous data after event end + X days
