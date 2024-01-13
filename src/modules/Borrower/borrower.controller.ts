import { Request, Response } from "express";
import * as BorrowerService from "./borrower.service";
import { handleControllerError } from "../../utils/errors";
import {
    getPaginationQuerySchema,
    idSchema,
    registerBorrowerSchema,
} from "./borrower.validation";
import { BorrowerItem } from "./borrower.model";

// register borrower/user
export const registerBorrower = async (req: Request, res: Response) => {
    try {
        const { name, email } = registerBorrowerSchema.parse(req.body);
        const borrower = await BorrowerService.registerBorrower(name, email);
        return res.status(201).json(borrower);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const updateBorrower = async (req: Request, res: Response) => {
    try {
        const borrowerId = idSchema.parse(req.params.id);
        const borrowerData = registerBorrowerSchema
            .partial()
            .parse(req.body) as BorrowerItem;
        const borrower = await BorrowerService.updateBorrower(
            borrowerId,
            borrowerData,
        );
        if (!borrower)
            return res.status(404).json({
                message: `Borrower with id ${borrowerId} not found`,
            });
        return res.status(200).json(borrower);
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
