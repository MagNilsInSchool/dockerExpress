import { Router } from "express";
import {
    createPlayer,
    deletePlayer,
    getInactivePlayers,
    getPlayer,
    getPlayers,
    getPlayerScore,
    getPlayersFavoriteGame,
    getPlayersScores,
    getRecentlyJoinedPlayers,
    getTop3PlayerScores,
    updatePlayer,
} from "../controllers/playersController.ts";

export const playersRoute = Router();

// http://localhost:1338/players/
playersRoute.get("/", getPlayers);
// http://localhost:1338/players/
playersRoute.post("/", createPlayer);
// http://localhost:1338/players/scores
playersRoute.get("/scores", getPlayersScores);
// http://localhost:1338/players/top
playersRoute.get("/top", getTop3PlayerScores);
// http://localhost:1338/players/inactive
playersRoute.get("/inactive", getInactivePlayers);
// http://localhost:1338/players/recent
playersRoute.get("/recent", getRecentlyJoinedPlayers);
// http://localhost:1338/players/favorite-game
playersRoute.get("/favorite-game", getPlayersFavoriteGame);

//! Param routes after static routes to prevent errors. Can also specify :id to be numbers ex: router.get("/:id(\\d+)", getPlayer), although getPlayerScore :id is a string...
//! Scores should probably be it's own route.
// http://localhost:1338/players/:id
playersRoute.get("/:id", getPlayer);
// http://localhost:1338/players/:id
playersRoute.delete("/:id", deletePlayer);
// http://localhost:1338/players/:id
playersRoute.patch("/:id", updatePlayer);
// http://localhost:1338/players/:id/scores
playersRoute.get("/:id/scores", getPlayerScore);
