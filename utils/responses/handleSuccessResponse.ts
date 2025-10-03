import type { Response } from "express";

export interface SuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

export const makeSuccessResponse = <T>(message: string, data: T): SuccessResponse<T> => {
    return { success: true, message, data };
};

export const sendSuccessResponse = <T>(res: Response, message: string, data: T, status = 200) => {
    return res.status(status).json(makeSuccessResponse<T>(message, data));
};
