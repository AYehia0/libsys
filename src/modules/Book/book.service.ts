// the book service is responsible for handling all the CRUD operations on the book model
// basically seperating the business logic from the controller and the routes
// allows for easy testing and maintainance

// import the book model
import { BookItem, Book } from "./book.interface";

// add a book to the database
// for now we don't have a database so we will just return the book
export const addBook = async (body: any): Promise<BookItem> => {
    const book: Book = {
        id: 1,
        isbn: body.isbn,
        title: body.title,
        author: body.author,
        genre: body.genre,
        quantity_available: body.quantity_available as number,
        shelf_location: body.shelf_location,
    };
    return book;
};
