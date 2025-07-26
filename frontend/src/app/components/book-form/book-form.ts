// frontend/src/app/components/book-form/book-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book.servcie'; 
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode: boolean = false;
  bookId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      isbn: ['', Validators.required],
      disponible: [true] // Nuevo campo, por defecto disponible
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookId = Number(params.get('id'));
      if (this.bookId && !isNaN(this.bookId)) {
        this.isEditMode = true;
        this.bookService.getBookById(this.bookId).subscribe({
          next: (book) => {
            this.bookForm.patchValue(book);
          },
          error: (err) => {
            console.error('Error al cargar libro para edición:', err);
            alert('No se pudo cargar el libro para edición.');
            this.router.navigate(['/books']);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const book: Book = this.bookForm.value;
      if (this.isEditMode && this.bookId) {
        this.bookService.updateBook(this.bookId, book).subscribe({
          next: () => {
            alert('Libro actualizado con éxito');
            this.router.navigate(['/books']);
          },
          error: (err) => {
            console.error('Error al actualizar libro:', err);
            alert('Error al actualizar el libro.');
          }
        });
      } else {
        this.bookService.createBook(book).subscribe({
          next: () => {
            alert('Libro creado con éxito');
            this.router.navigate(['/books']);
          },
          error: (err) => {
            console.error('Error al crear libro:', err);
            alert('Error al crear el libro.');
          }
        });
      }
    } else {
      alert('Por favor, completa el formulario correctamente.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }
}