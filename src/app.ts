// imports
import express from "express";
import { Express } from "express";
import cors from "cors";
import helmet from "helmet";

// the routers
import bookRouter from "./modules/Book/book.routes";
import borrowerRouter from "./modules/Borrower/borrower.routes";
import { handle404Error } from "./utils/404.errors";
import { welcomeAPI } from "./utils/shared-routes";
import rateLimit from "express-rate-limit";
import { limiterConfig } from "./utils/rate-limiter.config";

// allow dependency injection
export const createExpressApp = (): Express => {
    const app = express();

    // the middlewares
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    const API_URL = process.env.API_URL || "/api/v1";

    app.use(rateLimit(limiterConfig));
    app.get("/", welcomeAPI);

    // the routes goes here
    app.use(`${API_URL}/books`, bookRouter);
    app.use(`${API_URL}/borrowers`, borrowerRouter);
    app.use(handle404Error);
    return app;
};

export default createExpressApp;
