// frontend/src/app/models/user.model.ts
export interface User {
  id?: number;
  nombre: string;
  email: string;
  fecha_registro?: string;
}

export interface UserWithLoanInfo extends User {
  libro_en_prestamo?: {
    id: number;
    titulo: string;
    autor: string;
    isbn: string;
  } | null;
}