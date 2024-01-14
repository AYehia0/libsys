import * as z from "zod";

const MAX_BORROWER_LIMIT = 25;

export const registerBorrowerSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(4).max(255), // TODO: it's just a password, not strong
});

export const loginBorrowerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(255),
});

// TODO: it's duplicate code, we can move it to a shared placed
export const idSchema = z.string().regex(/^\d+$/).transform(Number);

export const getPaginationQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).default("1").transform(Number),
    limit: z
        .string()
        .regex(/^\d+$/)
        .default(String(MAX_BORROWER_LIMIT))
        .transform(Number),
});
