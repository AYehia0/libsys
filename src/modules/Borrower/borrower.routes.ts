import { Router } from "express";
import * as BorrowerController from "./borrower.controller";
import * as cache from "route-cache";
import { auth } from "../../middlewares/auth";
import { catchAuthErrors } from "../../middlewares/error";

// create the book Router
const router = Router();

router.post("/register", BorrowerController.registerBorrower);
router.post("/login", BorrowerController.loginBorrower);
router.get(
    "/me/books",
    auth,
    catchAuthErrors,
    cache.cacheSeconds(10),
    BorrowerController.getBorrowedBooks,
);
router.get("/", cache.cacheSeconds(10), BorrowerController.getAllBorrowers);
router.patch("/me", auth, catchAuthErrors, BorrowerController.updateBorrower);
router.get("/:id", cache.cacheSeconds(10), BorrowerController.getBorrowerById);
router.delete("/:id", BorrowerController.deleteBorrowerById);

export default router;
