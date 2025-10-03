import express from "express";
import { gamesRoute } from "./routes/gamesRoute.ts";

const app = express();

const PORT = 1338;

app.use(express.json());
app.use("/games", gamesRoute);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
