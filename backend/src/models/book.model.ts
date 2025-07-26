// backend/src/models/book.model.ts
export interface Book {
    id?: number;
    titulo: string;
    autor: string;
    isbn: string;
    disponible: boolean;
}