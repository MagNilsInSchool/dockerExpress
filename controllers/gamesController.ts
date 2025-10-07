import type { Request, Response } from "express";
import { pool } from "../utils/pool.ts";
import { CustomError, handleError } from "../utils/responses/handleErrorResponse.ts";
import { sendSuccessResponse } from "../utils/responses/handleSuccessResponse.ts";
import { type Game, gameInputSchema, gameUpdateSchema } from "../schemas/gamesSchema.ts";
import type { GenrePlays } from "../interfaces/index.ts";
import { postGresIdSchema } from "../schemas/postrgresIdSchema.ts";

// @desc GET fetches all available games.
// @route /games
export const getGames = async (req: Request, res: Response) => {
    try {
        const result = await pool.query<Game>("SELECT * FROM games ORDER BY id");
        sendSuccessResponse(res, "Successfully fetched games!", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET fetches specific game based on id. Id must be an integer with no more than 9 digits.
// @route /games/:id
export const getGame = async (req: Request, res: Response) => {
    try {
        const validatedId = postGresIdSchema.safeParse(req.params);
        if (!validatedId.success) throw validatedId.error;

        const result = await pool.query<Game>("SELECT * FROM games WHERE id = $1", [validatedId.data.id]);

        if (result.rows.length === 0) throw new CustomError(`No game with id: ${validatedId.data.id} found!`, 404);

        sendSuccessResponse(res, "Successfully fetched game!", result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc PUT updates game with a new title and/or genre. :id must be the game id.
// @route /games/:id
export const updateGame = async (req: Request, res: Response) => {
    try {
        const validatedId = postGresIdSchema.safeParse(req.params);
        if (!validatedId.success) throw validatedId.error;

        const validatedGameUpdate = gameUpdateSchema.safeParse(req.body);
        if (!validatedGameUpdate.success) throw validatedGameUpdate.error;

        // COALESCE will use the first non null value. NULLIF will treat an empty string as null.
        const result = await pool.query<Game>(
            `
            UPDATE games
            SET title = COALESCE(NULLIF($1, ''), title),
                genre = COALESCE(NULLIF($2, ''), genre)
            WHERE id = $3
            RETURNING id, title, genre;
            `,
            [validatedGameUpdate.data.title ?? null, validatedGameUpdate.data.genre ?? null, validatedId.data.id] // Turns undefined to null so it will be omitted in the update and use fallback(existing value) instead
        );

        if (result.rows.length === 0) throw new CustomError(`No game with id: ${validatedId.data.id} found!`, 404);

        sendSuccessResponse(res, "Successfully updated game!", result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc DELETE deletes game. :id must be the game id.
// @route /games/:id
export const deleteGame = async (req: Request, res: Response) => {
    try {
        const validatedId = postGresIdSchema.safeParse(req.params);
        if (!validatedId.success) throw validatedId.error;

        const result = await pool.query<Game>(
            `
            DELETE FROM games
            WHERE id = $1
            RETURNING id, title, genre;
            `,
            [validatedId.data.id]
        );

        if (result.rows.length === 0) {
            throw new CustomError(`No game with id: ${validatedId.data.id} found!`, 404);
        }

        sendSuccessResponse(res, "Successfully deleted game!", result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc POST creates a new game. Must supply title and genre in json-body.
// @route /games
export const createGame = async (req: Request, res: Response) => {
    try {
        const validatedGame = gameInputSchema.safeParse(req.body);

        if (!validatedGame.success) throw validatedGame.error;

        const result = await pool.query<Game>(
            `
            INSERT INTO games(title,genre)
            VALUES($1,$2)
            RETURNING id, title, genre;`,
            [validatedGame.data.title, validatedGame.data.genre]
        );
        sendSuccessResponse(res, `Succesfully added ${validatedGame.data.title} to games list`, result.rows[0], 201);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET the top 3 most played genres.
// @route /games/genres/top
export const getTop3GameGenres = async (req: Request, res: Response) => {
    try {
        const result = await pool.query<GenrePlays>(`
            SELECT g.genre, COUNT(s.id) AS plays
            FROM games g
            JOIN scores s ON s.game_id = g.id
            GROUP BY g.id, g.genre
            ORDER BY plays DESC, g.genre DESC
            LIMIT 3;`);

        if (result.rows.length === 0) {
            throw new CustomError("No games have been played yet", 404);
        }
        sendSuccessResponse(res, "Successfully fetched top 3 game genres!", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};
