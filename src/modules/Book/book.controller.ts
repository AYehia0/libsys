// import the service
import * as BookService from "./book.service";
import { Request, Response } from "express";
import {
    createBookSchema,
    getAllBooksQuerySchema,
    getBookByIdSchema,
    getSearchQuerySchema,
} from "./book.validation";
import { BookItem } from "./book.model";
import { handleControllerError } from "../../utils/errors";

// add a book controller
export const addBook = async (req: Request, res: Response) => {
    try {
        const bookData = createBookSchema.parse(req.body) as BookItem;
        const book = await BookService.addBook(bookData);
        return res.status(201).json(book);
    } catch (err) {
        handleControllerError(res, err);
    }
};

// get all books controller with pagination
export const getAllBooks = async (req: Request, res: Response) => {
    try {
        const { page, limit } = getAllBooksQuerySchema.parse(req.query);
        const books = await BookService.getAllBooks(page, limit);
        return res.status(200).json(books);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const getBookById = async (req: Request, res: Response) => {
    try {
        const bookid = getBookByIdSchema.parse(req.params.id);
        const book = await BookService.getBookById(bookid);
        if (book) return res.status(200).json(book);

        return res.status(404).json({ msg: "Book not found" });
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const deleteBookById = async (req: Request, res: Response) => {
    try {
        const bookid = getBookByIdSchema.parse(req.params.id);
        const book = await BookService.deleteBookById(bookid);
        // TODO: is 200 the correct status code here?
        if (book)
            return res
                .status(200)
                .json({ msg: "Book was deleted succesfully" });
        return res.status(404).json({ msg: "Book not found" });
    } catch (err) {
        handleControllerError(res, err);
    }
};

// search for a book by title, author, genre, or isbn
export const searchBook = async (req: Request, res: Response) => {
    try {
        const { title, genre, isbn, author, page, limit } =
            getSearchQuerySchema.parse(req.query);

        const books = await BookService.searchBook(
            { title, isbn, genre, author },
            page,
            limit,
        );
        return res.status(200).json(books);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const updateBookById = async (req: Request, res: Response) => {
    try {
        const bookid = getBookByIdSchema.parse(req.params.id);
        const bookData = createBookSchema.partial().parse(req.body) as BookItem;
        const book = await BookService.updateBookById(bookid, bookData);
        return res.status(200).json(book);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const borrowBook = async (req: Request, res: Response) => {
    try {
        const { bookid, borrowerid } = req.body;
        const borrowing = await BookService.borrowBook(bookid, borrowerid);
        return res.status(200).json(borrowing);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const returnBook = async (req: Request, res: Response) => {
    try {
        const bookid = getBookByIdSchema.parse(req.params.id);
        const borrowing = await BookService.returnBook(bookid);
        return res.status(200).json(borrowing);
    } catch (err) {
        handleControllerError(res, err);
    }
};
