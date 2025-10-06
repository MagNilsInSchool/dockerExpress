import { z } from "zod";
import { postGresIdSchema } from "./postrgresIdSchema.ts";

export const playerInputSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: "Name must contain at least 2 letters." })
            .max(15, { message: "Name must contain at most 15 letters." }),
    })
    .strict();

// Combines playerInputSchema and postGresIdSchema then adds join_date. z.preprocess is run before validation where we check if the value if a string, if so it gets turned into a date object, else remains as is. Is then checked if it is a date.
export const playerSchema = playerInputSchema.extend(postGresIdSchema.shape).extend({
    join_date: z.preprocess((v) => (typeof v === "string" ? new Date(v) : v), z.date()),
});

export type PlayerInput = z.infer<typeof playerInputSchema>;
export type Player = z.infer<typeof playerSchema>;
