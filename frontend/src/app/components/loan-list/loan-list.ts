// frontend/src/app/components/loan-list/loan-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // RouterLink es para los enlaces [routerLink]
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.css'
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];
  filterActive: boolean = false; // Para alternar entre todos y activos

  constructor(private loanService: LoanService, private router: Router) { }

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    if (this.filterActive) {
      this.loanService.getActiveLoans().subscribe({
        next: (data) => this.loans = data,
        error: (err) => console.error('Error al cargar préstamos activos:', err)
      });
    } else {
      this.loanService.getAllLoans().subscribe({
        next: (data) => this.loans = data,
        error: (err) => console.error('Error al cargar todos los préstamos:', err)
      });
    }
  }

  toggleFilter(): void {
    this.filterActive = !this.filterActive;
    this.loadLoans(); // Vuelve a cargar los préstamos con el nuevo filtro
  }

  editLoan(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/loans/edit', id]);
    }
  }

  returnBook(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de que quieres marcar este libro como devuelto?')) {
      this.loanService.returnBook(id).subscribe({
        next: () => {
          alert('Libro devuelto con éxito.');
          this.loadLoans(); // Recargar la lista para reflejar el cambio
        },
        error: (err) => {
          console.error('Error al devolver el libro:', err);
          alert('Error al devolver el libro: ' + (err.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  deleteLoan(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de que quieres eliminar este préstamo? Esto también marcará el libro como disponible si no fue devuelto.')) {
      this.loanService.deleteLoan(id).subscribe({
        next: () => {
          alert('Préstamo eliminado con éxito.');
          this.loadLoans(); // Recargar la lista
        },
        error: (err) => {
          console.error('Error al eliminar préstamo:', err);
          alert('Error al eliminar el préstamo: ' + (err.error?.message || 'Error desconocido'));
        }
      });
    }
  }
}