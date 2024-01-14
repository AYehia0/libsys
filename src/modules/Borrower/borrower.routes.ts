import { Router } from "express";
import * as BorrowerController from "./borrower.controller";
import * as cache from "route-cache";

// create the book Router
const router = Router();

router.post("/register", BorrowerController.registerBorrower);
router.get(
    "/:id/books",
    cache.cacheSeconds(10),
    BorrowerController.getBorrowedBooks,
);
router.get("/", cache.cacheSeconds(10), BorrowerController.getAllBorrowers);
router.patch("/:id", BorrowerController.updateBorrower);
router.get("/:id", cache.cacheSeconds(10), BorrowerController.getBorrowerById);
router.delete("/:id", BorrowerController.deleteBorrowerById);

export default router;
