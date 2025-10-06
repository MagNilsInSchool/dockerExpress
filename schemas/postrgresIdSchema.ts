import { z } from "zod";
// Coerce does the same thing as Number("1").
export const postGresIdSchema = z
    .object({
        id: z.coerce.number().int().min(1).max(2_147_483_647), //Postgres INTEGER can't be larger than this.
    })
    .strict();

export type PostgresId = z.infer<typeof postGresIdSchema>;
