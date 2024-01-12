// import the controller for the book module
import * as BookController from "./book.controller";
import { Router } from "express";

// create the book Router
const router = Router();

router.post("/", BookController.addBook);
router.get("/search", BookController.searchBook);
router.get("/", BookController.getAllBooks);
router.get("/:id", BookController.getBookById);
router.delete("/:id", BookController.deleteBookById);

export default router;
