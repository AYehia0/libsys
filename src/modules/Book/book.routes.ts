// import the controller for the book module
import * as BookController from "./book.controller";
import { Router } from "express";

// create the book Router
const router = Router();

router.post("/borrow", BookController.borrowBook);
router.post("/return/:id", BookController.returnBook);
router.post("/", BookController.addBook);
router.get("/search", BookController.searchBook);
router.get("/", BookController.getAllBooks);
router.get("/:id", BookController.getBookById);
router.delete("/:id", BookController.deleteBookById);
router.patch("/:id", BookController.updateBookById);

export default router;
