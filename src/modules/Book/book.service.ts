// the book service is responsible for handling all the CRUD operations on the book model
// basically seperating the business logic from the controller and the routes
// allows for easy testing and maintainance

// import the book model
import { NotFoundError } from "../../utils/controller.errors";
import { BookItem, BookModel, Borrowing } from "./book.model";

// add a book to the database
// for now we don't have a database so we will just return the book
export const addBook = async (body: any): Promise<BookItem> => {
    const book: BookItem = {
        isbn: body.isbn,
        title: body.title,
        author: body.author,
        genre: body.genre,
        quantity: body.quantity as number,
        shelf_location: body.shelf_location,
    };

    // add the book to the database
    const savedBook = await BookModel.saveBook(book);
    return savedBook;
};

export const getAllBooks = async (page: number, limit: number) => {
    const books = await BookModel.getAllBooks(page, limit);
    return books;
};

export const getBookById = async (id: number) => {
    const book = await BookModel.getBookById(id);
    return book;
};

export const deleteBookById = async (id: number) => {
    const book = await BookModel.deleteBookById(id);
    return book;
};

// search for a book by title, author, genre, or isbn
export const searchBook = async (
    query: { title?: string; author?: string; genre?: string; isbn?: string },
    page: number,
    limit: number,
) => {
    const books = await BookModel.searchBook(query, page, limit);
    return books;
};

export const updateBookById = async (
    id: number,
    body: BookItem,
): Promise<BookItem> => {
    // check if the book exists
    const bookExists = await BookModel.getBookById(id);
    // TODO: have a nice error handling one
    if (!bookExists) throw new NotFoundError("Book not found");
    const book = await BookModel.updateBookById(id, body);
    return book;
};

// the book can be borrowed by a user
export const borrowBook = async (
    id: number,
    user_id: number,
): Promise<Borrowing> => {
    const borrowing = await BookModel.borrowBook(id, user_id);
    return borrowing;
};

// the book can be returned by a user
export const returnBook = async (
    borrowerid: number,
    id: number,
): Promise<Borrowing> => {
    const borrowing = await BookModel.returnBook(borrowerid, id);
    return borrowing;
};

export const getOverdueBooks = async (page: number, limit: number) => {
    const books = await BookModel.getOverdueBooks(page, limit);
    return books;
};
