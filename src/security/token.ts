// implement jwt for authorization
import jwt from "jsonwebtoken";
import { Borrower } from "../modules/Borrower/borrower.model";
import { BorrowerPayload } from "../@types/payload";

export const generateToken = (borrower: Borrower): string => {
    const payload: BorrowerPayload = {
        id: borrower.id,
        name: borrower.name,
        email: borrower.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1d",
    });

    return token;
};

export const verifyToken = (token: string): BorrowerPayload => {
    const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!,
    ) as BorrowerPayload;
    return payload;
};
