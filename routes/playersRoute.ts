import { Router } from "express";
import {
    createPlayer,
    getInactivePlayers,
    getPlayers,
    getPlayerScore,
    getPlayersFavoriteGame,
    getPlayersScores,
    getRecentlyJoinedPlayers,
    getTop3PlayerScores,
} from "../controllers/playersController.ts";

export const playersRoute = Router();

// http://localhost:1338/players/
playersRoute.get("/", getPlayers);
// http://localhost:1338/players/
playersRoute.post("/", createPlayer);
// http://localhost:1338/players/scores
playersRoute.get("/scores", getPlayersScores);
// http://localhost:1338/players/:id/scores
playersRoute.get("/:id/scores", getPlayerScore);
// http://localhost:1338/players/top
playersRoute.get("/top", getTop3PlayerScores);
// http://localhost:1338/players/inactive
playersRoute.get("/inactive", getInactivePlayers);
// http://localhost:1338/players/recent
playersRoute.get("/recent", getRecentlyJoinedPlayers);
// http://localhost:1338/players/favorite-game
playersRoute.get("/favorite-game", getPlayersFavoriteGame);
