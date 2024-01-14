import database from "../../database";
import { ConflictError } from "../../utils/controller.errors";
import { Book } from "../Book/book.model";

export interface BorrowerItem {
    name: string;
    email: string;
    password: string;
}

export interface Borrower extends BorrowerItem {
    id: number;
}

export class BorrowerModel {
    static async registerBorrower(
        borrower: Omit<Borrower, "id">,
    ): Promise<Borrower> {
        const sql = `
            INSERT INTO borrowers (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at;
        `;

        const result = await database.runQuery(sql, [
            borrower.name,
            borrower.email,
            borrower.password,
        ]);
        return result.rows[0];
    }
    // update borrower details by id or email
    static async updateBorrower(
        id: number,
        borrower: BorrowerItem,
    ): Promise<Boolean> {
        // check for existing emails and exclude the current borrower's email from the check
        const sql = `
            UPDATE borrowers
            SET name = $1, email = $2
            WHERE id = $3
              AND NOT EXISTS (
                SELECT 1
                FROM borrowers
                WHERE email = $2 AND id <> $3
              )
            RETURNING id, name, email, created_at;
        `;

        const result = await database.runQuery(sql, [
            borrower.name,
            borrower.email,
            id,
        ]);

        // check the reason for the update failure, not the best way to do this but this is my sql world works :(
        if (result.rowCount === 0) {
            const borrower = await this.getBorrowerById(id);
            if (borrower.email === borrower.email)
                throw new ConflictError("Email already exists");
        }
        return result.rowCount ? true : false;
    }
    static async getBorrowerById(id: number): Promise<Borrower> {
        const sql = `
            SELECT id, name, email, created_at
            FROM borrowers
            WHERE id = $1;
        `;

        const result = await database.runQuery(sql, [id]);
        return result.rows[0];
    }
    static async deleteBorrowerById(id: number): Promise<Boolean> {
        const sql = `
            DELETE FROM borrowers
            WHERE id = $1;
        `;

        const result = await database.runQuery(sql, [id]);
        // return true if the borrower was deleted
        return result.rowCount ? true : false;
    }

    static async getAllBorrowers(
        page: number,
        limit: number,
    ): Promise<Borrower[]> {
        const offset = (page - 1) * limit;
        const sql = `
            SELECT id, name, email, created_at
            FROM borrowers
            ORDER BY id
            LIMIT $1 OFFSET $2;
        `;

        const result = await database.runQuery(sql, [limit, offset]);
        return result.rows;
    }
    // FIXME: this actually doesn't return Book[] but Book[] - book.created_at + borrowed_at, returned_at, due_at
    static async getBorrowedBooks(borrowerId: number): Promise<Book[]> {
        const sql = `
            SELECT books.id, books.title, books.author, books.genre, books.isbn, borrowing.borrowed_at, borrowing.returned_at, borrowing.due_at
            FROM books
            INNER JOIN borrowing ON books.id = borrowing.book_id
            WHERE borrowing.borrower_id = $1
            ORDER BY borrowing.due_at DESC;
        `;

        const result = await database.runQuery(sql, [borrowerId]);
        return result.rows;
    }

    static async getBorrowerByEmail(email: string): Promise<Borrower> {
        const sql = `
            SELECT id, name, email, password, created_at
            FROM borrowers
            WHERE email = $1;
        `;

        const result = await database.runQuery(sql, [email]);
        return result.rows[0];
    }
}
