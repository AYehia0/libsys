import { Request, Response } from "express";

// catch all 404 errors middleware
export const handle404Error = (req: Request, res: Response) => {
    res.status(404).json({
        message: `The requested route: ${req.path} couldn't be found.`,
    });
};
