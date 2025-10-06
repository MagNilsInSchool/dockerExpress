import type { Request, Response } from "express";
import { pool } from "../utils/pool.ts";
import { CustomError, handleError } from "../utils/responses/handleErrorResponse.ts";
import { sendSuccessResponse } from "../utils/responses/handleSuccessResponse.ts";
import { type Player, playerInputSchema } from "../schemas/playerSchema.ts";

// @desc GET fetches all players.
// @route /players
export const getPlayers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query<Player>(`
            SELECT * FROM players;`);

        if (result.rows.length === 0) {
            sendSuccessResponse(res, `No registered players!`, []);
            return;
        }

        sendSuccessResponse(res, "Successfully fetched all info on players!", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc POST creates a new player. Must supply name in json-body.
// @route /players
export const createPlayer = async (req: Request, res: Response) => {
    try {
        const validatedName = playerInputSchema.safeParse(req.body);
        if (!validatedName.success) throw validatedName.error;

        const result = await pool.query<Player>(
            `
            INSERT INTO players(name)
            VALUES($1)
            RETURNING id, name, join_date;`,
            [validatedName.data.name]
        );
        sendSuccessResponse(res, `Succesfully added ${validatedName.data.name} to players list`, result.rows[0], 201);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET fetches all players with scores for played games.
// @route /players/scores
export const getPlayersScores = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT players.name, games.title, scores.score
            FROM players
            INNER JOIN scores ON players.id = scores.player_id
            INNER JOIN games ON games.id = scores.game_id
            ORDER BY players.name;`);

        if (result.rows.length === 0) {
            sendSuccessResponse(res, `No games have been played!`, []);
            return;
        }

        sendSuccessResponse(res, "Successfully fetched all gamescore info on players!", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET fetches all player scores for played games. :id is players.name
// @route /players/:id/scores
export const getPlayerScore = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idStringNormalized = id.trim().toLowerCase();

        if (idStringNormalized.length > 15) throw new CustomError(":id length is not allowed to be more than 15.", 400);

        const result = await pool.query(
            `
            SELECT players.name, games.title, scores.score
            FROM players
            LEFT JOIN scores ON players.id = scores.player_id
            LEFT JOIN games ON games.id = scores.game_id
            WHERE LOWER(players.name) = $1;
            `,
            [idStringNormalized]
        );

        if (result.rows.length === 0) throw new CustomError(`No player with name: ${idStringNormalized} found!`, 404);

        const scores = result.rows
            .filter((result) => result.score !== null)
            .map((r) => ({ title: r.title, score: r.score }));

        if (scores.length === 0) {
            sendSuccessResponse(res, `Player ${result.rows[0].name} has not registered any scores yet.`, {
                name: result.rows[0].name,
                scores: [],
            });
            return;
        }

        sendSuccessResponse(res, `Successfully fetched ${result.rows[0].name} scores!`, {
            name: result.rows[0].name,
            scores,
        });
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET fetches top3 players based on totalscore of games played.
// @route /players/top
export const getTop3PlayerScores = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT p.name, SUM(s.score) AS total_score 
            FROM players p
            JOIN scores s ON p.id = s.player_id
            GROUP BY p.id, p.name
            ORDER BY total_score DESC
            LIMIT 3;`);

        if (result.rows.length === 0) {
            sendSuccessResponse(res, `No games have been played!`, []);
            return;
        }
        sendSuccessResponse(res, "Successfully fetched top 3 scores!", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET fetches players that have played no games.
// @route /players/inactive
export const getInactivePlayers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query<Player>(`
            SELECT * 
            FROM players p
            LEFT JOIN scores s ON p.id = s.player_id
            WHERE s.id IS NULL
            ORDER BY p.id;`);

        if (result.rows.length === 0) {
            sendSuccessResponse(res, "There are no inactive players!", result.rows);
            return;
        }

        sendSuccessResponse(res, "Successfully fetched inactive", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET fetches players that joined within the last 30 days.
// @route /players/recent
export const getRecentlyJoinedPlayers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query<Player>(`
            SELECT * 
            FROM players p
            WHERE p.join_date >= CURRENT_DATE - INTERVAL '30 days'
            ORDER BY p.join_date ASC;`);

        if (result.rows.length === 0) {
            sendSuccessResponse(res, "There are no new players within the last 30 days", []);
            return;
        }

        sendSuccessResponse(res, "Successfully fetched players registered within the last 30 days.", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// @desc GET fetches each players favorite game.
// @route /players/favorite-game
export const getPlayersFavoriteGame = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            WITH plays_per_game AS (
            SELECT player_id, game_id, COUNT(*) AS plays
            FROM scores
            GROUP BY player_id, game_id
            ),
            ranked AS (
            SELECT *,
                    ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY plays DESC) AS rn
            FROM plays_per_game
            )
            SELECT p.id, p.name, g.title, r.plays
            FROM ranked r
            JOIN players p ON p.id = r.player_id
            JOIN games  g ON g.id = r.game_id
            WHERE r.rn = 1
            ORDER BY p.id;`);

        if (result.rows.length === 0) {
            sendSuccessResponse(res, `No games have been played!`, []);
            return;
        }

        sendSuccessResponse(res, "Successfully fetched players favorite games.", result.rows);
    } catch (error) {
        handleError(error, res);
    }
};
