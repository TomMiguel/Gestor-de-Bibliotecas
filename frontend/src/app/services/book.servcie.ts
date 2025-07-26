// frontend/src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = '/api/books'; // URL base para los endpoints de libros

  constructor(private http: HttpClient) { }

  // Obtener todos los libros o solo los disponibles
  getBooks(availableOnly: boolean = false): Observable<Book[]> {
    const url = availableOnly ? `${this.apiUrl}?disponible=true` : this.apiUrl;
    return this.http.get<Book[]>(url);
  }

  // Obtener un libro por ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo libro
  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // Actualizar un libro existente
  updateBook(id: number, book: Partial<Book>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, book);
  }

  // Eliminar un libro
  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}