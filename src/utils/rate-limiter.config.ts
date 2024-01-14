import { Request, Response } from "express";
import { Options } from "express-rate-limit";

export const limiterConfig: Partial<Options> = {
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    handler: (_: Request, res: Response) => {
        res.status(429).json({
            message: "Too many requests, please try again later.",
        });
    },
};
