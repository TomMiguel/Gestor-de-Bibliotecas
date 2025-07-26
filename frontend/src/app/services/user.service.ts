// frontend/src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Para hacer peticiones HTTP
import { Observable } from 'rxjs'; // Para manejar flujos de datos asíncronos
import { User, UserWithLoanInfo } from '../models/user.model'; // Importa las interfaces de usuario

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class UserService {
  private apiUrl = '/api/users'; // URL base para los endpoints de usuarios de la API 

  constructor(private http: HttpClient) { } // Inyecta el cliente HTTP

  // Obtener todos los usuarios (con info de préstamo)
  getAllUsers(): Observable<UserWithLoanInfo[]> {
    return this.http.get<UserWithLoanInfo[]>(this.apiUrl);
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo usuario
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Actualizar un usuario existente
  updateUser(id: number, user: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}