// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';


import { Home } from './components/home/home';
import { UserListComponent } from './components/user-list/user-list';
import { UserFormComponent } from './components/user-form/user-form';
import { BookListComponent } from './components/book-list/book-list';
import { BookFormComponent} from './components/book-form/book-form';
import { LoanListComponent } from './components/loan-list/loan-list';
import { LoanFormComponent } from './components/loan-form/loan-form';

// *** Definir y exportar directamente el array de rutas ***
export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' }, // Ruta por defecto para la página de inicio
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserFormComponent}, // Ruta para crear un nuevo usuario
  { path: 'users/edit/:id', component: UserFormComponent }, // Ruta para editar un usuario existente, usando un ID dinámico
  { path: 'books', component: BookListComponent },
  { path: 'books/new', component: BookFormComponent}, // Ruta para crear un nuevo libro
  { path: 'books/edit/:id', component: BookFormComponent }, // Ruta para editar un libro existente
  { path: 'loans', component: LoanListComponent },
  { path: 'loans/new', component: LoanFormComponent }, // Ruta para registrar un nuevo préstamo
  { path: 'loans/edit/:id', component: LoanFormComponent },
  { path: '**', redirectTo: '' } // Ruta wildcard: redirige a la página de inicio si la URL no coincide con ninguna ruta
];