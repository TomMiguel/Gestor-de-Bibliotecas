// frontend/src/app/components/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para ngFor, ngIf
import { RouterLink } from '@angular/router';   // Necesario para routerLink
import { UserService } from '../../services/user.service'; // Importa tu servicio de usuario
import { UserWithLoanInfo } from '../../models/user.model'; // Importa la interfaz de usuario

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // Añade CommonModule y RouterLink a los imports
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserListComponent implements OnInit {
  users: UserWithLoanInfo[] = []; // Array para almacenar los usuarios

  constructor(private userService: UserService) { } // Inyecta el servicio de usuario

  ngOnInit(): void {
    this.loadUsers(); // Carga los usuarios cuando el componente se inicializa
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data; // Asigna los datos recibidos al array de usuarios
        console.log('Usuarios cargados:', this.users); // Para depuración
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  deleteUser(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID de usuario no definido para eliminar.');
      return;
    }
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          console.log(`Usuario con ID ${id} eliminado.`);
          this.users = this.users.filter(user => user.id !== id); // Elimina el usuario de la lista local
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          alert('Error al eliminar el usuario. Es posible que tenga un préstamo asociado.');
        }
      });
    }
  }
}