import type { Request, Response } from "express";
import { pool } from "../utils/pool.ts";
import { CustomError, handleError } from "../utils/responses/handleErrorResponse.ts";
import type { iGame } from "../interfaces/gameInterfaces.ts";
import { sendSuccessResponse } from "../utils/responses/handleSuccessResponse.ts";

// @desc GET fetches all available games.
// @route /games
export const getGames = async (req: Request, res: Response) => {
    try {
        const result = await pool.query<iGame>("SELECT * FROM games");
        sendSuccessResponse(res, "Successfully fetched games!", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET fetches specific game based on id. Id must be an integer.
// @route /games/:id
export const getGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);

        if (!Number.isInteger(idNum) || idNum <= 0) {
            throw new CustomError("ID must be a positive integer.", 400);
        }
        const result = await pool.query<iGame>("SELECT * FROM games WHERE id = $1", [idNum]);
        if (result.rows.length === 0) {
            throw new CustomError(`No game with id: ${idNum} found!`, 404);
        }
        sendSuccessResponse(res, "Successfully fetched game!", result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET the top 3 most played genres.
// @route /games/genres/top
export const getTop3GameGenres = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT g.genre, COUNT(s.id) AS plays
            FROM games g
            JOIN scores s ON s.game_id = g.id
            GROUP BY g.id, g.genre
            ORDER BY plays DESC, g.genre DESC
            LIMIT 3;`);

        if (result.rows.length === 0) {
            sendSuccessResponse(res, "No games have been played yet", result.rows);
        }
        sendSuccessResponse(res, "Successfully fetched top 3 game genres!", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};
