import { Request, Response } from "express";
import * as BorrowerService from "./borrower.service";
import { handleControllerError } from "../../utils/controller.errors";
import {
    getPaginationQuerySchema,
    idSchema,
    loginBorrowerSchema,
    registerBorrowerSchema,
} from "./borrower.validation";
import { BorrowerItem } from "./borrower.model";

// register borrower/user
export const registerBorrower = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = registerBorrowerSchema.parse(
            req.body,
        );
        const borrower = await BorrowerService.registerBorrower(
            name,
            email,
            password,
        );
        return res.status(201).json(borrower);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const loginBorrower = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginBorrowerSchema.parse(req.body);
        const token = await BorrowerService.loginBorrower(email, password);
        return res.status(200).json({
            token,
        });
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const updateBorrower = async (req: Request, res: Response) => {
    try {
        const borrowerData = registerBorrowerSchema
            .partial()
            .parse(req.body) as BorrowerItem;

        await BorrowerService.updateBorrower(req.borrower.id, borrowerData);
        return res.status(200).json({
            message: "Borrower was updated successfully",
        });
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const getBorrowerById = async (req: Request, res: Response) => {
    try {
        const borrowerId = idSchema.parse(req.params.id);
        const borrower = await BorrowerService.getBorrowerById(borrowerId);
        if (!borrower)
            return res.status(404).json({
                message: `Borrower with id ${borrowerId} not found`,
            });

        return res.status(200).json(borrower);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const deleteBorrowerById = async (req: Request, res: Response) => {
    try {
        const borrowerId = idSchema.parse(req.params.id);
        const borrower = await BorrowerService.deleteBorrowerById(borrowerId);
        if (!borrower)
            return res.status(404).json({
                message: `Borrower with id ${borrowerId} not found`,
            });

        return res.status(200).json({
            message: `Borrower with id ${borrowerId} deleted successfully`,
        });
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const getAllBorrowers = async (req: Request, res: Response) => {
    try {
        const { page, limit } = getPaginationQuerySchema.parse(req.query);
        const borrowers = await BorrowerService.getAllBorrowers(page, limit);
        return res.status(200).json(borrowers);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const getBorrowedBooks = async (req: Request, res: Response) => {
    try {
        const books = await BorrowerService.getBorrowedBooks(req.borrower.id);
        return res.status(200).json(books);
    } catch (err) {
        handleControllerError(res, err);
    }
};
