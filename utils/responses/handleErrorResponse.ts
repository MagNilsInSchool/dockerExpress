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

export interface ErrorResponse<T = unknown> {
    success: false;
    message: string;
    error?: string;
    details?: T;
}

export const makeErrorResponse = <T = unknown>(message: string, error?: string, details?: T): ErrorResponse<T> => {
    return { success: false, message, error, details };
};

export const sendErrorResponse = <T = unknown>(
    res: Response,
    message: string,
    error?: string,
    details?: T,
    status = 500
) => {
    return res.status(status).json(makeErrorResponse<T>(message, error, details));
};

export const handleError = (error: unknown, res: Response, code: number = 500) => {
    console.error("Error occurred:", error);

    if (error instanceof ZodError) {
        return sendErrorResponse(res, "Validation failed", undefined, formatValidationErrors(error), 400);
    }

    if (error instanceof CustomError) {
        return sendErrorResponse(res, error.message, undefined, undefined, error.code);
    }

    return sendErrorResponse(
        res,
        "Internal server error",
        error instanceof Error ? error.message : "Unknown error",
        undefined,
        code
    );
};
