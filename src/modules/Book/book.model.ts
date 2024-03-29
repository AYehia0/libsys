// create the functions to add a book to the database
// get all the books from the database with pagination
// get a book from the database by id
// update a book in the database by id
// delete a book from the database by id
// search for a book by title, author, genre, or isbn

// import the database connection
import { PoolClient } from "pg";
import database from "../../database";
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
} from "../../utils/controller.errors";
import { BorrowerModel } from "../Borrower/borrower.model";

const MAX_DUE_DAYS = 30;

export interface BookItem {
    isbn: string;
    title: string;
    author: string;
    genre: string;
    quantity: number;
    shelf_location: string;
}

// Separation for senerios where we need to assert a book without an id
export interface Book extends BookItem {
    id: number;
    created_at: Date;
}

export interface BorrowingItem {
    borrower_id: number;
    book_id: number;
    borrowed_at: Date;
    returned_at: Date;
    due_at: Date;
}
export interface Borrowing extends BorrowingItem {
    id: number;
}

export class BookModel {
    public static async saveBook(book: BookItem): Promise<Book> {
        const sql = `
            INSERT INTO books (isbn, title, author, genre, quantity, shelf_location)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, isbn, title, author, genre, quantity, shelf_location, created_at;
        `;

        const result = await database.runQuery(sql, [
            book.isbn,
            book.title,
            book.author,
            book.genre,
            book.quantity,
            book.shelf_location,
        ]);
        return result.rows[0];
    }

    // get all the books from the database with pagination : page and limit
    public static async getAllBooks(
        page: number,
        limit: number,
    ): Promise<Book[]> {
        const offset = (page - 1) * limit;
        const sql = `
            SELECT * FROM books
            LIMIT $1 OFFSET $2;
        `;

        const result = await database.runQuery(sql, [limit, offset]);
        return result.rows;
    }

    public static async getBookById(id: number): Promise<Book> {
        const sql = `
            SELECT * FROM books
            WHERE id = $1;
        `;

        const result = await database.runQuery(sql, [id]);
        return result.rows[0];
    }
    // return true if the book was deleted successfully else return false
    public static async deleteBookById(id: number): Promise<boolean> {
        const sql = `
            DELETE FROM books
            WHERE id = $1;
        `;

        const result = await database.runQuery(sql, [id]);
        return result.rowCount ? true : false;
    }

    // search for a book by title, author, genre, or isbn
    // limit the search results to 25 books per page
    public static async searchBook(
        query: {
            title?: string;
            author?: string;
            genre?: string;
            isbn?: string;
        },
        page: number,
        limit: number,
    ): Promise<Book[]> {
        const offset = (page - 1) * limit;
        const sql = `
            SELECT * FROM books
            WHERE 
                (title ILIKE $1 OR $1 IS NULL)
                AND (author ILIKE $2 OR $2 IS NULL)
                AND (genre ILIKE $3 OR $3 IS NULL)
                AND (isbn ILIKE $4 OR $4 IS NULL)
            ORDER BY created_at DESC, quantity DESC
            LIMIT $5 OFFSET $6
        `;
        const result = await database.runQuery(sql, [
            query.title ? `%${query.title}%` : null,
            query.author ? `%${query.author}%` : null,
            query.genre ? `%${query.genre}%` : null,
            query.isbn ? `%${query.isbn}%` : null,
            limit,
            offset,
        ]);
        return result.rows;
    }
    // update a book in the database by id
    // given id and the book details, there could be missing details, only update the ones that are provided
    public static async updateBookById(
        bookid: number,
        book: Partial<BookItem>,
    ) {
        const sql = `
            UPDATE books
            SET isbn = COALESCE($1, isbn),
                title = COALESCE($2, title),
                author = COALESCE($3, author),
                genre = COALESCE($4, genre),
                quantity = COALESCE($5, quantity),
                shelf_location = COALESCE($6, shelf_location)
            WHERE id = $7
            RETURNING id, isbn, title, author, genre, quantity, shelf_location;
        `;
        const result = await database.runQuery(sql, [
            book.isbn,
            book.title,
            book.author,
            book.genre,
            book.quantity,
            book.shelf_location,
            bookid,
        ]);
        return result.rows[0];
    }
    private static async getBookByIdForUpdate(
        client: PoolClient,
        id: number,
    ): Promise<Book> {
        const sql = `
            SELECT * FROM books
            WHERE id = $1
            FOR UPDATE;
        `;
        const result = await client.query(sql, [id]);
        return result.rows[0];
    }
    private static async updateBookQuantity(
        client: PoolClient,
        id: number,
        updown: number,
    ): Promise<Book> {
        // either increase or decrease the quantity of the book by updown
        const sql = `
            UPDATE books
            SET quantity = quantity + $1
            WHERE id = $2
            RETURNING id, isbn, title, author, genre, quantity, shelf_location;
        `;
        const result = await client.query(sql, [updown, id]);
        return result.rows[0];
    }
    private static async createBorrowing(
        client: PoolClient,
        book_id: number,
        user_id: number,
    ): Promise<Borrowing> {
        const sql = `
            INSERT INTO borrowing (book_id, borrower_id, borrowed_at, returned_at, due_at)
            VALUES ($1, $2, NOW(), NULL, NOW() + INTERVAL '${MAX_DUE_DAYS} seconds')
            RETURNING id, book_id, borrower_id, borrowed_at, returned_at, due_at;
        `;
        const result = await client.query(sql, [book_id, user_id]);
        return result.rows[0];
    }

    static async borrowBook(id: number, user_id: number): Promise<Borrowing> {
        // use the database.runTransaction function to run the transaction
        const borrowing = await database.runTransaction(
            async (client: PoolClient) => {
                // get the book by id and lock the row for update
                const book = await BookModel.getBookByIdForUpdate(client, id);
                // check if the book isn't null
                if (!book || book.quantity <= 0)
                    throw new ConflictError(
                        "Can't borrow this book right now, either it doesn't exist or it's out of stock",
                    );

                // check if the user/borrower exists
                const borrower = await BorrowerModel.getBorrowerById(user_id);

                if (!borrower) throw new NotFoundError("Borrower not found");

                // decrease the book quantity by 1
                const updatedBook = await BookModel.updateBookQuantity(
                    client,
                    book.id,
                    -1,
                );
                const borrowing = await BookModel.createBorrowing(
                    client,
                    updatedBook.id,
                    user_id,
                );
                return borrowing;
            },
        );

        return borrowing;
    }
    // return a book by id, update the borrowing record set the returned_at to NOW() and status to returned
    static async returnBook(
        borrowerId: number,
        borrowingId: number,
    ): Promise<Borrowing> {
        // if the book already returned or the borrower didn't borrow it, throw an error
        // use a transaction to update the borrowing record and the book quantity
        const borrowing = await database.runTransaction(
            async (client: PoolClient) => {
                // check if the user is the one who borrowed the book
                let sql = `
                SELECT * FROM borrowing
                WHERE id = $1 AND borrower_id = $2 AND returned_at IS NULL;
            `;

                let result = await client.query(sql, [borrowingId, borrowerId]);
                if (!result.rows.length)
                    throw new ForbiddenError("You can't return this book");

                // update the borrowing record
                sql = `
                UPDATE borrowing
                SET returned_at = NOW()
                WHERE id = $1
                RETURNING id, book_id, borrower_id, borrowed_at, returned_at, due_at;
            `;
                result = await client.query(sql, [borrowingId]);
                const borrowing = result.rows[0];

                // increase the book quantity by 1
                await BookModel.updateBookQuantity(
                    client,
                    borrowing.book_id,
                    1,
                );
                return result.rows[0];
            },
        );
        return borrowing;
    }

    // get overdue books for all borrowers with pagination
    static async getOverdueBooks(page: number, limit: number): Promise<Book[]> {
        const offset = (page - 1) * limit;
        const sql = `
            SELECT books.id, books.title, books.isbn, borrowing.borrowed_at, borrowing.returned_at, borrowing.due_at, borrowing.borrower_id
            FROM borrowing
            INNER JOIN books ON borrowing.book_id = books.id
            WHERE borrowing.due_at < NOW() AND borrowing.returned_at IS NULL
            ORDER BY borrowing.due_at DESC
            LIMIT $1 OFFSET $2;
        `;

        const result = await database.runQuery(sql, [limit, offset]);
        return result.rows;
    }
}
