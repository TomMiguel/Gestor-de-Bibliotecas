// frontend/src/app/models/loan.model.ts
import { User } from './user.model'; // Importa la interfaz User
import { Book } from './book.model'; // Importa la interfaz Book

export interface Loan {
  id?: number;
  id_usuario: number;
  id_libro: number;
  fecha_prestamo: string;
  fecha_devolucion: string | null;
  user?: User;
  book?: Book;
}