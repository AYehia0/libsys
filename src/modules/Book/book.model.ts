// create the functions to add a book to the database
// get all the books from the database with pagination
// get a book from the database by id
// update a book in the database by id
// delete a book from the database by id
// search for a book by title, author, genre, or isbn

// import the database connection
import database from "../../database";
import { BorrowerModel } from "../Borrower/borrower.model";

const MAX_DUE_DAYS = 14;

export interface BookItem {
    isbn: string;
    title: string;
    author: string;
    genre: string;
    quantity: number;
    shelf_location: number;
}

// Separation for senerios where we need to assert a book without an id
export interface Book extends BookItem {
    id: number;
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
    public static async saveBook(book: Omit<Book, "id">): Promise<Book> {
        const sql = `
            INSERT INTO books (isbn, title, author, genre, quantity, shelf_location)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, isbn, title, author, genre, quantity, shelf_location;
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
    public static async updateBookById(bookid: number, book: BookItem) {
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
        client: any,
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
        client: any,
        id: number,
        quantity: number,
    ): Promise<Book> {
        const sql = `
            UPDATE books
            SET quantity = $1
            WHERE id = $2
            RETURNING id, isbn, title, author, genre, quantity, shelf_location;
        `;
        const result = await client.query(sql, [quantity, id]);
        return result.rows[0];
    }
    private static async createBorrowing(
        client: any,
        book_id: number,
        user_id: number,
    ): Promise<Borrowing> {
        const sql = `
            INSERT INTO borrowing (book_id, borrower_id, borrowed_at, returned_at, due_at)
            VALUES ($1, $2, NOW(), NULL, NOW() + INTERVAL '${MAX_DUE_DAYS} days')
            RETURNING id, book_id, borrower_id, borrowed_at, returned_at, due_at;
        `;
        const result = await client.query(sql, [book_id, user_id]);
        return result.rows[0];
    }

    static async borrowBook(id: number, user_id: number): Promise<Borrowing> {
        // use the database.runTransaction function to run the transaction
        const borrowing = await database.runTransaction(async (client) => {
            // get the book by id and lock the row for update
            const book = await BookModel.getBookByIdForUpdate(client, id);
            // check if the book isn't null
            if (!book || book.quantity <= 0) {
                throw new Error("Book not available");
            }
            // check if the user/borrower exists
            const borrower = await BorrowerModel.getBorrowerById(user_id);

            if (!borrower) {
                throw new Error("Borrower not found");
            }

            const updatedBook = await BookModel.updateBookQuantity(
                client,
                book.id,
                book.quantity - 1,
            );
            const borrowing = await BookModel.createBorrowing(
                client,
                updatedBook.id,
                user_id,
            );
            return borrowing;
        });

        return borrowing;
    }
    // return a book by id, update the borrowing record set the returned_at to NOW() and status to returned
    static async returnBook(id: number): Promise<Borrowing> {
        // check if the book already returned by : CONSTRAINT check_borrowing CHECK (borrowed_at < returned_at)
        // if the book already returned, throw an error
        let sql = `
            SELECT * FROM borrowing
            WHERE id = $1
            AND returned_at IS NOT NULL;
        `;
        const isReturned = await database.runQuery(sql, [id]);
        if (isReturned.rows.length > 0) {
            throw new Error("Book already returned");
        }
        sql = `
            UPDATE borrowing
            SET returned_at = NOW()
            WHERE id = $1
            RETURNING id, book_id, borrower_id, borrowed_at, returned_at, due_at;
        `;
        const result = await database.runQuery(sql, [id]);
        return result.rows[0];
    }
}
