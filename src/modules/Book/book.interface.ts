export interface BookItem {
    isbn: string;
    title: string;
    author: string;
    genre: string;
    quantity_available: number;
    shelf_location: string;
}

// Separation for senerios where we need to assert a book without an id
export interface Book extends BookItem {
    id: number;
}
