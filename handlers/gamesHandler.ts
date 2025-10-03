import type { Request, Response } from "express";
import { pool } from "../utils/pool.ts";
import { CustomError, handleError } from "../utils/responses/handleErrorResponse.ts";
import type { iGame } from "../interfaces/gameInterfaces.ts";
import { sendSuccessResponse } from "../utils/responses/handleSuccessResponse.ts";

export const getGames = async (req: Request, res: Response) => {
    try {
        const result = await pool.query<iGame>("SELECT * FROM games");
        sendSuccessResponse(res, "Successfully fetched games!", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

export const getGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);

        if (!Number.isInteger(idNum) || idNum <= 0) {
            throw new CustomError("id must be a positive integer.", 400);
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
