-- Create the Borrowers table
CREATE TABLE Borrowers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Books table
CREATE TABLE Books (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    quantity INTEGER CHECK (quantity >= 0) NOT NULL,
    shelf_location INTEGER NOT NULL,
    genre VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Borrowing table
CREATE TABLE Borrowing (
    id SERIAL PRIMARY KEY,
    borrower_id INTEGER REFERENCES Borrowers(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES Books(id) ON DELETE CASCADE,
    borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP,
    due_at TIMESTAMP,
    CONSTRAINT check_borrowing CHECK (borrowed_at < returned_at)
);

-- Indexes for faster read operations
CREATE INDEX idx_books_title ON Books(title);
CREATE INDEX idx_books_author ON Books(author);

-- May be useful for retrieving books that already available for borrowing.
CREATE INDEX idx_books_quantity ON Books(quantity);

-- Essential for efficiently retrieving borrowing information for a specific user or book.
CREATE INDEX idx_borrowing_user_book ON Borrowing(borrower_id, book_id);
