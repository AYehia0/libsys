import { z } from "zod";

const MAX_LENGTH = 255;
const MAX_BOOK_LIMIT = 25;

export const createBookSchema = z.object({
    title: z.string().nonempty("Book must have a title").max(MAX_LENGTH),
    author: z.string().nonempty("Book must have an author").max(MAX_LENGTH),
    genre: z.string().max(50),
    quantity: z.number().int().min(0),
    shelf_location: z.number().int().min(0),
    isbn: z.string().min(1).max(MAX_LENGTH),
});

// validate input from query : page and limit
// the page and limit are strings by default so we need to parse them to numbers
export const getAllBooksQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).default("1").transform(Number),
    limit: z
        .string()
        .regex(/^\d+$/)
        .default(String(MAX_BOOK_LIMIT))
        .transform(Number),
});

export const getBookByIdSchema = z.string().regex(/^\d+$/).transform(Number);

// the search query can be one of the following : title, author, genre, isbn or combination of them
export const getSearchQuerySchema = z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    isbn: z.string().optional(),
    genre: z.string().optional(),
    page: z.string().regex(/^\d+$/).default("1").transform(Number),
    limit: z
        .string()
        .regex(/^\d+$/)
        .default(String(MAX_BOOK_LIMIT))
        .transform(Number),
});
