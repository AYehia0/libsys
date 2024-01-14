// import the controller for the book module
import * as BookController from "./book.controller";
import { Router } from "express";
import * as cache from "route-cache";

// create the book Router
const router = Router();

router.post("/borrow", BookController.borrowBook);
router.post("/return/:id", BookController.returnBook);
router.post("/", BookController.addBook);
router.get("/search", cache.cacheSeconds(10), BookController.searchBook);
router.get("/", cache.cacheSeconds(10), BookController.getAllBooks);
router.get("/overdue", cache.cacheSeconds(10), BookController.getOverdueBooks);
router.get("/:id", cache.cacheSeconds(20), BookController.getBookById);
router.delete("/:id", BookController.deleteBookById);
router.patch("/:id", BookController.updateBookById);

export default router;
