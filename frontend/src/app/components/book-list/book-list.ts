// frontend/src/app/components/book-list/book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para ngFor, ngIf, date pipe
import { RouterLink } from '@angular/router';   // Necesario para routerLink
import { BookService } from '../../services/book.servcie'; // Importa tu servicio de libro
import { Book } from '../../models/book.model'; // Importa la interfaz de libro

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // Añade CommonModule y RouterLink a los imports
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookListComponent implements OnInit {
  books: Book[] = []; // Array para almacenar los libros

  constructor(private bookService: BookService) { } // Inyecta el servicio de libro

  ngOnInit(): void {
    this.loadBooks(); // Carga los libros cuando el componente se inicializa
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data; // Asigna los datos recibidos al array de libros
        console.log('Libros cargados:', this.books); // Para depuración
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  deleteBook(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID de libro no definido para eliminar.');
      return;
    }
    if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          console.log(`Libro con ID ${id} eliminado.`);
          this.books = this.books.filter(book => book.id !== id); // Elimina el libro de la lista local
        },
        error: (err) => {
          console.error('Error al eliminar libro:', err);
          alert('Error al eliminar el libro. Es posible que tenga un préstamo asociado.');
        }
      });
    }
  }
}