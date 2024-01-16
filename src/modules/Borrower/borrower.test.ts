import { configureEnv } from "../../utils/env";
configureEnv();

import * as BorrowerService from "./borrower.service";
import createPgDatabase from "../../database/index";
import { Borrower } from "./borrower.model";
import { verifyToken } from "../../security/token";
import { BorrowerPayload } from "../../@types/payload";
import { addBook, borrowBook } from "../Book/book.service";

beforeAll(async () => {
    await createPgDatabase.runMigrations();
});

afterAll(async () => {
    await createPgDatabase.closeConnection();
});

const registerBorrowerTest = async (
    name: string,
    email: string,
    password: string,
): Promise<Borrower> => {
    const registeredBorrower = await BorrowerService.registerBorrower(
        name,
        email,
        password,
    );

    expect(registeredBorrower).toBeTruthy();
    expect(registeredBorrower.name).toEqual(name);
    expect(registeredBorrower.email).toEqual(email);

    return registeredBorrower;
};

const loginBorrowerTest = async (
    email: string,
    password: string,
    registered: Borrower,
): Promise<BorrowerPayload> => {
    // login the borrower
    const token = await BorrowerService.loginBorrower(email, password);

    // verify the jwt token
    const decoded = verifyToken(token);

    expect(token).toBeTruthy();
    expect(decoded.id).toEqual(registered.id);
    expect(decoded.name).toEqual(registered.name);

    return decoded;
};

describe("Borrower module", () => {
    it("should register a borrower", async () => {
        const borrower = {
            name: "Doe John",
            email: "doe@doe.com",
            password: "password",
        };
        registerBorrowerTest(borrower.name, borrower.email, borrower.password);
    });

    it("should login a borrower", async () => {
        const borrower = {
            name: "another Doe John",
            email: "another@doe.com",
            password: "password",
        };
        const registered = await registerBorrowerTest(
            borrower.name,
            borrower.email,
            borrower.password,
        );

        await loginBorrowerTest(borrower.email, borrower.password, registered);
    });

    it("should get a borrower by id", async () => {
        const borrower = {
            name: "Jeff Doe",
            email: "jeff@jeff.com",
            password: "password",
        };

        const registered = await registerBorrowerTest(
            borrower.name,
            borrower.email,
            borrower.password,
        );

        const fetchedBorrower = await BorrowerService.getBorrowerById(
            registered.id,
        );

        expect(fetchedBorrower).toBeTruthy();
        expect(fetchedBorrower.id).toEqual(registered.id);
        expect(fetchedBorrower.name).toEqual(registered.name);
        expect(fetchedBorrower.email).toEqual(registered.email);
    });

    it("should update a borrower", async () => {
        const borrower = {
            name: "Max Doe",
            email: "max@max.com",
            password: "password",
        };

        const registered = await registerBorrowerTest(
            borrower.name,
            borrower.email,
            borrower.password,
        );

        const updatedBorrower = {
            name: "John Doe Jr.",
        };

        const isUpdated = await BorrowerService.updateBorrower(
            registered.id,
            updatedBorrower,
        );

        expect(isUpdated).toBeTruthy();
        expect(isUpdated).toEqual(true);

        // get the updated borrower
        const fetchedBorrower = await BorrowerService.getBorrowerById(
            registered.id,
        );

        expect(fetchedBorrower).toBeTruthy();
        expect(fetchedBorrower.id).toEqual(registered.id);
        expect(fetchedBorrower.name).toEqual(updatedBorrower.name);
    });

    it("should delete a borrower by id", async () => {
        const borrower = {
            name: "May Doe",
            email: "may@may.com",
            password: "password",
        };
        const registered = await registerBorrowerTest(
            borrower.name,
            borrower.email,
            borrower.password,
        );
        const deletedBorrower = await BorrowerService.deleteBorrowerById(
            registered.id,
        );
        expect(deletedBorrower).toBeTruthy();
        expect(deletedBorrower).toEqual(true);

        // get the deleted Borrower
        const fetchedBorrower = await BorrowerService.getBorrowerById(
            registered.id,
        );
        expect(fetchedBorrower).toBeFalsy();
    });

    it("should get all borrowers", async () => {
        const borrowers = [
            {
                name: "user1",
                email: "user1@email.com",
                password: "password",
            },
            {
                name: "user2",
                email: "user2@email.com",
                password: "password",
            },
            {
                name: "user3",
                email: "user3@email.com",
                password: "password",
            },
        ];

        for (const borrower of borrowers) {
            await registerBorrowerTest(
                borrower.name,
                borrower.email,
                borrower.password,
            );
        }

        const fetchedBorrowers = await BorrowerService.getAllBorrowers(1, 3);

        expect(fetchedBorrowers).toBeTruthy();
        expect(fetchedBorrowers.length).toBe(borrowers.length);
    });
    it("should get borrowed books for a user", async () => {
        const book = {
            title: "Silly farts",
            author: "Fartman",
            genre: "Farts",
            quantity: 3,
            shelf_location: "G1",
            isbn: "9780132750884",
        };

        const addedBook = await addBook(book);

        // borrow some books
        const borrower = {
            name: "user4",
            email: "user4@email.com",
            password: "password",
        };
        const registered = await registerBorrowerTest(
            borrower.name,
            borrower.email,
            borrower.password,
        );
        for (let i = 0; i < book.quantity; i++) {
            await borrowBook(addedBook.id, registered.id);
        }

        // get the borrowed book
        const borrowedBooks = await BorrowerService.getBorrowedBooks(
            registered.id,
        );

        expect(borrowedBooks).toBeTruthy();
        expect(borrowedBooks.length).toBe(book.quantity);
    });
});
