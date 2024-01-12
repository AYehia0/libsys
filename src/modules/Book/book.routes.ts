// import the controller for the book module
import * as BookController from "./book.controller";
import { Router } from "express";

// create the book Router
const router = Router();

router.post("/", BookController.addBook);

export default router;
