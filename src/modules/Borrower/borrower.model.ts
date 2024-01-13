import database from "../../database";

export interface BorrowerItem {
    name: string;
    email: string;
}

export interface Borrower extends BorrowerItem {
    id: number;
}

export class BorrowerModel {
    static async registerBorrower(
        borrower: Omit<Borrower, "id">,
    ): Promise<Borrower> {
        const sql = `
            INSERT INTO borrowers (name, email)
            VALUES ($1, $2)
            RETURNING id, name, email, created_at;
        `;

        const result = await database.runQuery(sql, [
            borrower.name,
            borrower.email,
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
        // return true if the borrower was updated
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
}
