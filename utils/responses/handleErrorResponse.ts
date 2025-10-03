import { ZodError } from "zod";
import type { Response } from "express";

export class CustomError extends Error {
    code: number;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        this.name = "CustomError";
    }
}

const formatValidationErrors = (zodError: ZodError) => {
    return zodError.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
        expected: "expected" in issue ? issue.expected : undefined,
        received: "received" in issue ? issue.received : undefined,
    }));
};

export const handleError = (error: unknown, res: Response, code: number = 500) => {
    console.error("Error occurred:", error);

    if (error instanceof ZodError) {
        return res.status(400).send({
            error: "Validation failed",
            details: formatValidationErrors(error),
            message: "The API response doesn't match the expected schema",
        });
    }

    if (error instanceof CustomError) {
        return res.status(error.code).send({
            error: error.message,
        });
    }

    res.status(code).send({
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Internal server error",
    });
};
