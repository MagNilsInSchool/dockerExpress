# Docker Express - Game Scores API

Small Express + TypeScript API.
Uses PostgreSQL (see [compose.yml](compose.yml)).

## Quick links

-   Server entry: [server.ts](server.ts)
-   API routes: [`gamesRoute`](routes/gamesRoute.ts), [`playersRoute`](routes/playersRoute.ts)
-   Controllers: [`controllers/gamesController.ts`](controllers/gamesController.ts), [`controllers/playersController.ts`](controllers/playersController.ts)
-   DB pool: [`utils/pool.ts`](utils/pool.ts)
-   Response helpers: [`utils/responses/handleSuccessResponse.ts`](utils/responses/handleSuccessResponse.ts), [`utils/responses/handleErrorResponse.ts`](utils/responses/handleErrorResponse.ts)
-   Schemas: [`schemas/gamesSchema.ts`](schemas/gamesSchema.ts), [`schemas/playerSchema.ts`](schemas/playerSchema.ts), [`schemas/postrgresIdSchema.ts`](schemas/postrgresIdSchema.ts)
-   Utilities: [`utils/numbers.ts`](utils/numbers.ts)
-   DB setup / sample data: [sqlMemo.sql](sqlMemo.sql)
-   Docker compose: [compose.yml](compose.yml)
-   Package config / scripts: [package.json](package.json)

## Requirements

-   Node.js (recommended latest LTS)
-   PostgreSQL (the project includes a Docker Compose file to run a db + pgAdmin)

## Environment

Create a .env file at project root containing:

-   DB_HOST
-   DB_DATABASE
-   DB_USER
-   DB_PASSWORD
-   DB_PORT

And for pgAdmin:

-   PGADMIN_DEFAULT_EMAIL
-   PGADMIN_DEFAULT_PASSWORD
-   PGADMIN_PORT

An example is provided in the workspace `.env` (not committed). See [compose.yml](compose.yml).

## Run (local)

Install deps and start in dev mode:

```sh
npm install
npm run dev
```

Server listens on port 1338 by default (see [server.ts](server.ts)).

## Run (docker)

Use the provided compose file:

```sh
docker compose -f compose.yml up -d
```

This will start PostgreSQL and pgAdmin using values from your `.env`.

## Database

-   Schema and seed data: [sqlMemo.sql](sqlMemo.sql)
-   Connection pool is created in [`utils/pool.ts`](utils/pool.ts).

## API overview (important routes)

> [!IMPORTANT]  
> Base url by default: http://localhost:1338

Games

-   GET /games/ -> [`getGames`](controllers/gamesController.ts)
-   POST /games/ -> [`createGame`](controllers/gamesController.ts)
-   GET /games/genre/popular -> [`getTop3GameGenres`](controllers/gamesController.ts)
-   GET /games/:id -> [`getGame`](controllers/gamesController.ts)
-   PUT /games/:id -> [`updateGame`](controllers/gamesController.ts)
-   DELETE /games/:id -> [`deleteGame`](controllers/gamesController.ts)

Players

-   GET /players/ -> [`getPlayers`](controllers/playersController.ts)
-   POST /players/ -> [`createPlayer`](controllers/playersController.ts)
-   GET /players/scores -> [`getPlayersScores`](controllers/playersController.ts)
-   GET /players/top -> [`getTop3PlayerScores`](controllers/playersController.ts)
-   GET /players/inactive -> [`getInactivePlayers`](controllers/playersController.ts)
-   GET /players/recent -> [`getRecentlyJoinedPlayers`](controllers/playersController.ts)
-   GET /players/favorite-game -> [`getPlayersFavoriteGame`](controllers/playersController.ts)
-   GET /players/:id -> [`getPlayer`](controllers/playersController.ts)
-   PATCH /players/:id -> [`updatePlayer`](controllers/playersController.ts)
-   DELETE /players/:id -> [`deletePlayer`](controllers/playersController.ts)
-   GET /players/:id/scores -> [`getPlayerScore`](controllers/playersController.ts)

Validation is handled with Zod schemas in:

-   [`schemas/gamesSchema.ts`](schemas/gamesSchema.ts) (`gameInputSchema`, `gameUpdateSchema`, `gameSchema`)
-   [`schemas/playerSchema.ts`](schemas/playerSchema.ts) (`playerInputSchema`, `playerSchema`)
-   [`schemas/postrgresIdSchema.ts`](schemas/postrgresIdSchema.ts) (`postGresIdSchema`)

Error and success responses use:

-   [`utils/responses/handleErrorResponse.ts`](utils/responses/handleErrorResponse.ts) (`handleError`, `CustomError`)
-   [`utils/responses/handleSuccessResponse.ts`](utils/responses/handleSuccessResponse.ts) (`sendSuccessResponse`)

## Notes

-   TypeScript config: [tsconfig.json](tsconfig.json)
-   Linting: `npm run lint` / `npm run lintfix` (see [package.json](package.json))
-   Routes define parameter placement to avoid conflicts; see [`routes/gamesRoute.ts`](routes/gamesRoute.ts) and [`routes/playersRoute.ts`](routes/playersRoute.ts).

## Troubleshooting

-   If DB connection fails, verify `.env` values and Docker containers (see [compose.yml](compose.yml)).
-   Use [sqlMemo.sql](sqlMemo.sql) to re-create sample data if needed.
