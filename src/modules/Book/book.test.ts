// mock the database for testing purposes
import { configureEnv } from "../../utils/env";
configureEnv();

import * as BookService from "./book.service";
import { registerBorrower } from "../Borrower/borrower.service";
import createPgDatabase from "../../database/index";
import { BookItem } from "./book.model";

beforeAll(async () => {
    await createPgDatabase.runMigrations();
});

afterAll(async () => {
    await createPgDatabase.closeConnection();
});

// test add book
describe("Book module", () => {
    it("should add a book", async () => {
        const book = {
            title: "Clean Code",
            author: "Robert C. Martin",
            genre: "Software",
            quantity: 10,
            shelf_location: "A1",
            isbn: "9780132350884",
        };

        // testing the service layer only
        const addedBook = await BookService.addBook(book);
        expect(addedBook).toBeTruthy();
        expect(addedBook.title).toEqual(book.title);
        expect(addedBook.author).toEqual(book.author);
        expect(addedBook.genre).toEqual(book.genre);
        expect(addedBook.quantity).toEqual(book.quantity);
        expect(addedBook.shelf_location).toEqual(book.shelf_location);
        expect(addedBook.isbn).toEqual(book.isbn);
        expect(addedBook.id).toBeTruthy();
        expect(addedBook.created_at).toBeTruthy();
    });

    // test get all books
    it("should get all books with page and limit", async () => {
        const books = await BookService.getAllBooks(1, 1);
        expect(books).toBeTruthy();
        expect(books.length).toBe(1);
    });

    // test get book by id
    it("should get a book by id", async () => {
        const book = {
            title: "Clean Architecture",
            author: "Robert C. Martin",
            genre: "Software",
            quantity: 10,
            shelf_location: "B1",
            isbn: "9780134494166",
        };
        // add a book
        const addedBook = await BookService.addBook(book);

        // get the book by id
        const foundBook = await BookService.getBookById(addedBook.id);
        expect(foundBook).toBeTruthy();
        expect(foundBook.id).toEqual(addedBook.id);
        expect(foundBook.title).toEqual(addedBook.title);
        expect(foundBook.author).toEqual(addedBook.author);
        expect(foundBook.genre).toEqual(addedBook.genre);
        expect(foundBook.quantity).toEqual(addedBook.quantity);
        expect(foundBook.shelf_location).toEqual(addedBook.shelf_location);
        expect(foundBook.isbn).toEqual(addedBook.isbn);
        expect(foundBook.created_at).toBeTruthy();
    });

    // test update book
    it("should update a book", async () => {
        const book = {
            title: "Silly Architecture",
            author: "Silly C. Martin",
            genre: "Dumb Software",
            quantity: 1,
            shelf_location: "C1",
            isbn: "9780134404166",
        };
        // add a book
        const addedBook = await BookService.addBook(book);

        const update: Partial<BookItem> = {
            title: "Clean Architecture",
            quantity: 10,
        };

        // update the book by id
        const updatedBook = await BookService.updateBookById(
            addedBook.id,
            update,
        );

        expect(updatedBook).toBeTruthy();
        expect(updatedBook.id).toEqual(addedBook.id);
        expect(updatedBook.title).toEqual("Clean Architecture");
        expect(updatedBook.quantity).toEqual(10);
    });
    // test delete book
    it("should delete a book by id", async () => {
        const book = {
            title: "10 Minute Meals",
            author: "Jamie Oliver, hayya",
            genre: "Cooking",
            quantity: 3,
            shelf_location: "C1",
            isbn: "9720134404166",
        };
        // add a book

        const addedBook = await BookService.addBook(book);
        const deletedBook = await BookService.deleteBookById(addedBook.id);

        expect(deletedBook).toBeTruthy();
        expect(deletedBook).toEqual(true);
    });

    // test borrow book
    it("should borrow a book", async () => {
        const book = {
            title: "Great Expectations",
            author: "Charles Dickens",
            genre: "Classic",
            quantity: 3,
            shelf_location: "C31",
            isbn: "9720134904166",
        };

        // register a borrower
        const borrowerData = {
            name: "John Doe",
            email: "john@john.com",
            password: "password",
        };

        const borrower = await registerBorrower(
            borrowerData.name,
            borrowerData.email,
            borrowerData.password,
        );

        expect(borrower).toBeTruthy();
        expect(borrower).toHaveProperty("id");

        const addedBook = await BookService.addBook(book);
        const bookid = addedBook.id;

        const borrowing = await BookService.borrowBook(bookid, borrower.id);

        expect(borrowing).toBeTruthy();
        expect(borrowing.book_id).toEqual(bookid);
        expect(borrowing.borrower_id).toEqual(borrower.id);
    });
    // test return book
    it("should return a book", async () => {
        const book = {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            genre: "Classic",
            quantity: 3,
            shelf_location: "C31",
            isbn: "9020134904166",
        };

        // register a borrower
        const borrowerData = {
            name: "Mike Doe",
            email: "mike@mike.com",
            password: "password",
        };

        const borrower = await registerBorrower(
            borrowerData.name,
            borrowerData.email,
            borrowerData.password,
        );

        expect(borrower).toBeTruthy();
        expect(borrower).toHaveProperty("id");

        const addedBook = await BookService.addBook(book);
        const bookid = addedBook.id;

        const borrowing = await BookService.borrowBook(bookid, borrower.id);

        expect(borrowing).toBeTruthy();
        expect(borrowing.book_id).toEqual(bookid);

        const returning = await BookService.returnBook(
            borrower.id,
            borrowing.id,
        );

        expect(returning).toBeTruthy();
        expect(returning.book_id).toEqual(bookid);
        expect(returning.returned_at).toBeTruthy();
    });
});
