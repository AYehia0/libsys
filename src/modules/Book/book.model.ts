// create the functions to add a book to the database
// get all the books from the database with pagination
// get a book from the database by id
// update a book in the database by id
// delete a book from the database by id
// search for a book by title, author, genre, or isbn

// import the database connection
import database from "../../database";

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
}
