// catch all the errors middleware
import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/controller.errors";
import { jsonResponse } from "../utils/status";
import { TokenExpiredError } from "jsonwebtoken";

// TODO: refactor this to use the error classes
export const catchAuthErrors = (
    err: Error,
    _: Request,
    res: Response,
    next: NextFunction,
) => {
    switch (err.constructor) {
        case TokenExpiredError:
            return res
                .status(401)
                .json(jsonResponse("error", 401, "Token has expired"));

        case BadRequestError:
            return res
                .status(400)
                .json(jsonResponse("error", 400, err.message));
        case UnauthorizedError:
            return res
                .status(401)
                .json(jsonResponse("error", 401, err.message));
        default:
            return next(err);
    }
};
