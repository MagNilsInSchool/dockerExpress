import { z } from "zod";
import { postGresIdSchema } from "./postrgresIdSchema.ts";

export const gameInputSchema = z
    .object({
        title: z
            .string()
            .min(2, { message: "Title must contain at least 2 letters." })
            .max(50, { message: "Title must contain at most 20 letters." }),
        genre: z
            .string()
            .min(2, { message: "Genre must contain at least 2 letters." })
            .max(20, { message: "Genre must contain at most 20 letters." }),
    })
    .strict();

export const gameUpdateSchema = gameInputSchema
    .partial()
    .refine((obj) => Object.keys(obj).length > 0, {
        message: "At least one field must be provided for update",
    })
    .strict();

export const gameSchema = gameInputSchema.extend(postGresIdSchema.shape);

export type GameInput = z.infer<typeof gameInputSchema>;
export type GameUpdate = z.infer<typeof gameUpdateSchema>;
export type Game = z.infer<typeof gameSchema>;
