// the user/borrower can register in the system to be able to borrow books
// the registration requires the following information: name, and email (for simplicity)

import { BorrowerItem, Borrower, BorrowerModel } from "./borrower.model";
import { Book } from "../Book/book.model";
import { Password } from "../../security/password.hash";
import { generateToken } from "../../security/token";
import {
    NotFoundError,
    UnauthorizedError,
} from "../../utils/controller.errors";

export const registerBorrower = async (
    name: string,
    email: string,
    password: string,
): Promise<Borrower> => {
    const borrower: BorrowerItem = {
        name,
        email,
        password: Password.hash(password),
    };

    const savedBorrower = await BorrowerModel.registerBorrower(borrower);
    return savedBorrower;
};

export const loginBorrower = async (
    email: string,
    password: string,
): Promise<string> => {
    const borrower = await BorrowerModel.getBorrowerByEmail(email);
    if (!borrower) throw new NotFoundError("Borrower not found");

    const isPasswordValid = Password.compare(password, borrower.password);
    if (!isPasswordValid) throw new UnauthorizedError("Password is incorrect");

    // generate token
    const token = generateToken(borrower);

    return token;
};

export const updateBorrower = async (
    id: number,
    borrower: BorrowerItem,
): Promise<Boolean> => {
    return await BorrowerModel.updateBorrower(id, borrower);
};

export const getBorrowerById = async (id: number): Promise<Borrower> => {
    return await BorrowerModel.getBorrowerById(id);
};

export const deleteBorrowerById = async (id: number): Promise<Boolean> => {
    return await BorrowerModel.deleteBorrowerById(id);
};

export const getAllBorrowers = async (
    page: number,
    limit: number,
): Promise<Borrower[]> => {
    return await BorrowerModel.getAllBorrowers(page, limit);
};

export const getBorrowedBooks = async (borrowerId: number): Promise<Book[]> => {
    return await BorrowerModel.getBorrowedBooks(borrowerId);
};
