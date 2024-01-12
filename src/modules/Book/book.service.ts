// the book service is responsible for handling all the CRUD operations on the book model
// basically seperating the business logic from the controller and the routes
// allows for easy testing and maintainance

// import the book model
import { BookItem } from "./book.model";
import { BookModel } from "./book.model";

// add a book to the database
// for now we don't have a database so we will just return the book
export const addBook = async (body: any): Promise<BookItem> => {
    const book: BookItem = {
        isbn: body.isbn,
        title: body.title,
        author: body.author,
        genre: body.genre,
        quantity: body.quantity as number,
        shelf_location: body.shelf_location as number,
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
