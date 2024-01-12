// handle some of the repeated errors in the controllers
import { Response } from "express";
import { ZodError } from "zod";

export const handleControllerError = <T>(res: Response, err: T) => {
    if (err instanceof ZodError) {
        return res
            .status(400)
            .json({ error: "Validation Error", details: err.errors });
    }

    return res
        .status(500)
        .json({ error: "Server Error", details: (err as Error).message });
};
