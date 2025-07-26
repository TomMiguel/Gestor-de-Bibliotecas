// frontend/src/app/services/loan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model'; // Asegúrate de que esta interfaz esté correcta

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:3000/api/loans'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) { }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl);
  }

  getActiveLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/active`);
  }

  getLoanById(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`);
  }

  createLoan(loan: Omit<Loan, 'id' | 'user' | 'book'>): Observable<Loan> {
    // Aseguramos que la fecha_devolucion sea null si viene vacía
    const payload = {
      ...loan,
      fecha_devolucion: loan.fecha_devolucion || null
    };
    return this.http.post<Loan>(this.apiUrl, payload);
  }

  updateLoan(id: number, loan: Partial<Omit<Loan, 'id' | 'user' | 'book'>>): Observable<any> {
    // Aseguramos que la fecha_devolucion sea null si viene vacía
    const payload = {
      ...loan,
      fecha_devolucion: loan.fecha_devolucion === '' ? null : loan.fecha_devolucion
    };
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  returnBook(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/return`, {}); // El backend solo necesita el ID, el body puede estar vacío
  }

  deleteLoan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}