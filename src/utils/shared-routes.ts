import { Request, Response } from "express";

// a welcome api route for testing on /
export const welcomeAPI = (_: Request, res: Response) => {
    res.status(200).json({
        message:
            "Welcome to the library api: https://github.com/AYehia0/libsys",
    });
};
