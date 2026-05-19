# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

Use `pnpm` for all commands. Do not use npm or yarn.

## Commands

```bash
# Development
pnpm run start:dev        # Watch mode dev server
pnpm run build            # Compile TypeScript to dist/

# Tests
pnpm run test             # Unit tests (*.spec.ts)
pnpm run test:watch       # Unit tests in watch mode
pnpm run test:cov         # With coverage
pnpm run test:e2e         # E2E tests (test/jest-e2e.json)

# Code quality
pnpm run lint             # ESLint with auto-fix
pnpm run format           # Prettier

# Database migrations
pnpm run migration:generate src/migrations/<name>  # Generate from entity changes
pnpm run migration:run    # Apply pending migrations
pnpm run migration:revert # Rollback last migration
pnpm run migration:show   # Show migration status
```

## Architecture

NestJS REST API for guided tour event management. Deployed serverless on Vercel (`api/index.ts` wraps the NestJS app). Global API prefix is `/api`.

### Module Structure

Five business modules under `src/modules/`:

- **auth** — JWT + Passport. Two flows: (1) email/password → JWT for admins; (2) event share code → anonymous JWT for participants. Guards: `JwtAuthGuard`, `LocalAuthGuard`.
- **users** — Admin user CRUD + `AdminSeederService` (seeds super admin from env on startup).
- **events** — Event lifecycle with enforced state machine: `DRAFT → PLANNED/CANCELLED → ONGOING/CANCELLED → COMPLETED`. Generates 8-char alphanumeric share codes for participant joins.
- **routes** — Route + waypoint (Point) + segment management. `MappingService` integrates Mapbox for route calculation.
- **participation** — Participant joins via share code (anonymous UUID tracking). Real-time GPS position tracking. Join is idempotent: re-joining with the same anonymousId + eventId returns the existing participation.

### Database

TypeORM 0.3.28 with MySQL (Aiven cloud). `DB_SYNCHRONIZE=false` — always use migrations. SSL is enabled automatically when `NODE_ENV=production`.

- Config: [src/config/typeorm.config.ts](src/config/typeorm.config.ts)
- Migration data source: [src/config/data-source.ts](src/config/data-source.ts)
- Migrations directory: `src/migrations/`

### Authentication

- Admin JWT payload: `{ sub: userId, email, role: 'ADMINISTRATEUR', isAnonymous: false }`
- Participant JWT payload: `{ sub: participationId, role: 'PARTICIPANT', eventId, isAnonymous: true }`
- Token lifetime: 7 days (`JWT_EXPIRES_IN`)

### Enums (French values)

All domain enums use French string values in the database:
- `UserRole`: `ADMINISTRATEUR`, `PARTICIPANT`
- `EventStatus`: `BROUILLON`, `PLANIFIE`, `EN_COURS`, `TERMINE`, `ANNULE`
- `ParticipationStatus`: `INSCRIT`, `EN_COURS`, `TERMINE`, `ABANDONNE`
- `RouteType`: `NATIONALE`, `DEPARTEMENTALE`, `AUTOROUTE`, `MIXTE`
- `DifficultyLevel`: `FACILE`, `MOYEN`, `DIFFICILE`

### Global Exception Filter

[src/common/filters/global-exception.filter.ts](src/common/filters/global-exception.filter.ts) maps MySQL error codes (`ER_DUP_ENTRY` → 409, `ER_NO_REFERENCED_ROW_2` → 400, etc.) to HTTP responses. Applied globally in `main.ts`.

### Validation

`ValidationPipe` is global with `whitelist: true`, `transform: true`, `transformOptions: { enableImplicitConversion: true }`. Unknown properties are stripped automatically.

## Environment Variables

```env
DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
DB_SYNCHRONIZE=false
DB_LOGGING=true
JWT_SECRET, JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN=30d
SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, SUPERADMIN_FIRSTNAME, SUPERADMIN_LASTNAME
MAPPING_PROVIDER=mapbox
MAPBOX_TOKEN=<token>
PORT=3000
NODE_ENV=development|production
```

## Key Files

| File | Purpose |
|------|---------|
| [src/main.ts](src/main.ts) | Bootstrap, global prefix, Swagger, CORS, static files |
| [api/index.ts](api/index.ts) | Vercel serverless entrypoint (caches Express handler) |
| [src/app.module.ts](src/app.module.ts) | Root module, imports all 5 business modules |
| [src/config/typeorm.config.ts](src/config/typeorm.config.ts) | DB connection via ConfigService |
| [src/config/data-source.ts](src/config/data-source.ts) | TypeORM CLI data source for migrations |
