import { Router } from "express";
import { getGame, getGames } from "../handlers/gamesHandler.ts";

export const gamesRoute = Router();

gamesRoute.get("/", getGames);
gamesRoute.get("/:id", getGame);
