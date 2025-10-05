import { Router } from "express";
import { getGame, getGames, getTop3GameGenres } from "../controllers/gamesController.ts";

export const gamesRoute = Router();

// http://localhost:1338/games/
gamesRoute.get("/", getGames);
// http://localhost:1338/games/:id
gamesRoute.get("/:id", getGame);
// http://localhost:1338/games/genre/popular
gamesRoute.get("/genre/popular", getTop3GameGenres);
