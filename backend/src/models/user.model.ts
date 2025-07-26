// backend/src/models/user.model.ts
export interface User {
    id?: number; 
    nombre: string;
    email: string;
    fecha_registro?: string; 
}

// Interfaz para la información del usuario incluyendo el libro en préstamo
export interface UserWithLoanInfo extends User {
    libro_en_prestamo?: {
        id: number;
        titulo: string;
        autor: string;
        isbn: string;
    } | null; 
}