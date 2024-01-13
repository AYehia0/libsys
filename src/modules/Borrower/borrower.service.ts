// the user/borrower can register in the system to be able to borrow books
// the registration requires the following information: name, and email (for simplicity)

import { BorrowerItem, Borrower, BorrowerModel } from "./borrower.model";

export const registerBorrower = async (
    name: string,
    email: string,
): Promise<Borrower> => {
    const borrower: BorrowerItem = {
        name,
        email,
    };

    const savedBorrower = await BorrowerModel.registerBorrower(borrower);
    return savedBorrower;
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
