// frontend/src/app/models/book.model.ts
export interface Book {
  id?: number;
  titulo: string;
  autor: string;
  isbn: string;
  anio_publicacion?: number;
  disponible?: boolean;
}