// frontend/src/app/components/loan-form/loan-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { UserService } from '../../services/user.service';
import { BookService } from '../../services/book.servcie';
import { Loan } from '../../models/loan.model';
import { User } from '../../models/user.model';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-form.html',
  styleUrl: './loan-form.css'
})
export class LoanFormComponent implements OnInit {
  loanForm: FormGroup;
  isEditMode: boolean = false;
  loanId: number | null = null;
  users: User[] = [];
  books: Book[] = [];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private userService: UserService,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loanForm = this.fb.group({
      id_usuario: [null, Validators.required],
      id_libro: [null, Validators.required],
      fecha_prestamo: ['', Validators.required],
      fecha_devolucion: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsersAndBooks();

    this.route.paramMap.subscribe(params => {
      this.loanId = Number(params.get('id'));
      if (this.loanId && !isNaN(this.loanId)) {
        this.isEditMode = true;
        this.loanService.getLoanById(this.loanId).subscribe({
          next: (loan) => {
            const formattedLoanDate = loan.fecha_prestamo ? new Date(loan.fecha_prestamo).toISOString().substring(0, 10) : '';
            const formattedReturnDate = loan.fecha_devolucion ? new Date(loan.fecha_devolucion).toISOString().substring(0, 10) : '';

            this.loanForm.patchValue({
              id_usuario: loan.id_usuario, // Corregido: Acceder directamente a id_usuario
              id_libro: loan.id_libro,     // Corregido: Acceder directamente a id_libro
              fecha_prestamo: formattedLoanDate,
              fecha_devolucion: formattedReturnDate
            });
          },
          error: (err) => {
            console.error('Error al cargar préstamo para edición:', err);
            alert('No se pudo cargar el préstamo para edición.');
            this.router.navigate(['/loans']);
          }
        });
      }
    });
  }

  loadUsersAndBooks(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error al cargar usuarios:', err)
    });

    this.bookService.getBooks().subscribe({
      next: (data) => {
        if (!this.isEditMode) {
          this.books = data.filter(book => book.disponible);
        } else {
          this.books = data;
        }
      },
      error: (err) => console.error('Error al cargar libros:', err)
    });
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      const loanData = this.loanForm.value;

      if (this.isEditMode && this.loanId) {
        this.loanService.updateLoan(this.loanId, loanData).subscribe({
          next: () => {
            alert('Préstamo actualizado con éxito');
            this.router.navigate(['/loans']);
          },
          error: (err) => {
            console.error('Error al actualizar préstamo:', err);
            alert('Error al actualizar el préstamo: ' + (err.error?.message || 'Error desconocido'));
          }
        });
      } else {
        this.loanService.createLoan(loanData).subscribe({
          next: () => {
            alert('Préstamo creado con éxito');
            this.router.navigate(['/loans']);
          },
          error: (err) => {
            console.error('Error al crear préstamo:', err);
            alert('Error al crear el préstamo: ' + (err.error?.message || 'Error desconocido'));
          }
        });
      }
    } else {
      alert('Por favor, completa el formulario correctamente.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/loans']);
  }
}