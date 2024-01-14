import { BorrowerPayload } from "../payload";
declare global {
    namespace Express {
        interface Request {
            borrower: BorrowerPayload;
        }
    }
}
