// imports
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();

// the middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

const API_URL = process.env.API_URL || "/api/v1";

// the routers
import bookRouter from "./modules/Book/book.routes";
import borrowerRouter from "./modules/Borrower/borrower.routes";
import { handle404Error } from "./utils/404.errors";
import { welcomeAPI } from "./utils/shared-routes";

app.get("/", welcomeAPI);
app.use(handle404Error);

// the routes goes here
app.use(`${API_URL}/books`, bookRouter);
app.use(`${API_URL}/borrowers`, borrowerRouter);

export default app;
