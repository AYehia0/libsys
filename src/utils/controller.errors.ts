// handle some of the repeated errors in the controllers
import { Response } from "express";
import { ZodError } from "zod";
import { jsonResponse } from "./status";

class NotFoundError extends Error {
    statusCode = 404;
    status = "error";

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

class BadRequestError extends Error {
    statusCode = 400;
    status = "error";

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

class ServerError extends Error {
    statusCode = 500;
    status = "error";

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

class UnauthorizedError extends Error {
    statusCode = 401;
    status = "error";

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

class ForbiddenError extends Error {
    statusCode = 403;
    status = "error";

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

class ConflictError extends Error {
    statusCode = 409;
    status = "error";

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

// use the jsonReponse function from src/utils/status.ts to return a consistant json response
export const handleControllerError = (res: Response, err: unknown) => {
    const newError = err as Error;

    switch (newError.constructor) {
        case ZodError:
            return res
                .status(400)
                .json(
                    jsonResponse(
                        "error",
                        400,
                        "Validation Error",
                        JSON.parse(newError.message),
                    ),
                );

        case NotFoundError:
            return res
                .status((newError as NotFoundError).statusCode)
                .json(jsonResponse("error", 404, newError.message));

        case BadRequestError:
            return res
                .status((newError as BadRequestError).statusCode)
                .json(jsonResponse("error", 400, newError.message));

        case UnauthorizedError:
            return res
                .status((newError as UnauthorizedError).statusCode)
                .json(jsonResponse("error", 401, newError.message));

        case ForbiddenError:
            return res
                .status((newError as ForbiddenError).statusCode)
                .json(jsonResponse("error", 403, newError.message));

        case ConflictError:
            return res
                .status((newError as ConflictError).statusCode)
                .json(jsonResponse("error", 409, newError.message));

        default:
            return res
                .status(500)
                .json(jsonResponse("error", 500, newError.message));
            break;
    }
};

export {
    NotFoundError,
    BadRequestError,
    ServerError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
};
