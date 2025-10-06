import { Router } from "express";
import {
    createGame,
    deleteGame,
    getGame,
    getGames,
    getTop3GameGenres,
    updateGame,
} from "../controllers/gamesController.ts";

export const gamesRoute = Router();

// http://localhost:1338/games/
gamesRoute.get("/", getGames);
// http://localhost:1338/games/
gamesRoute.post("/", createGame);
// http://localhost:1338/games/:id
gamesRoute.get("/:id", getGame);
// http://localhost:1338/games/:id
gamesRoute.put("/:id", updateGame);
// http://localhost:1338/games/:id
gamesRoute.delete("/:id", deleteGame);
// http://localhost:1338/games/genre/popular
gamesRoute.get("/genre/popular", getTop3GameGenres);
