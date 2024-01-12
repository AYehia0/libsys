// import the service
import * as BookService from "./book.service";
import { Request, Response } from "express";

// add a book controller
export const addBook = async (req: Request, res: Response) => {
    try {
        const book = await BookService.addBook(req.body);
        return res.status(201).json(book);
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong!" });
    }
};
