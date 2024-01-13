import { Router } from "express";
import * as BorrowerController from "./borrower.controller";

// create the book Router
const router = Router();

router.post("/register", BorrowerController.registerBorrower);
router.get("/", BorrowerController.getAllBorrowers);
router.patch("/:id", BorrowerController.updateBorrower);
router.get("/:id", BorrowerController.getBorrowerById);
router.delete("/:id", BorrowerController.deleteBorrowerById);

export default router;
