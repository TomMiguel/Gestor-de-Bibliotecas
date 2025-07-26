// frontend/src/app/models/loan.model.ts
import { User } from './user.model';
import { Book } from './book.model';

export interface Loan {
  id?: number;
  id_usuario: number;
  id_libro: number;
  fecha_prestamo: string;
  fecha_devolucion: string | null;
  user?: User; 
  book?: Book; 
}