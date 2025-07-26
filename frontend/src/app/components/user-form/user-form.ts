// frontend/src/app/components/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; // Importar Router y ActivatedRoute
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Módulos para formularios reactivos
import { UserService } from '../../services/user.service'; // Importar tu servicio de usuario
import { User } from '../../models/user.model'; // Importar la interfaz de usuario

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Añadir ReactiveFormsModule aquí
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder, // Inyectar FormBuilder
    private userService: UserService, // Inyectar UserService
    private router: Router, // Inyectar Router para navegación
    private route: ActivatedRoute // Inyectar ActivatedRoute para obtener parámetros de URL
  ) {
    // Inicializar el formulario con validaciones
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Obtener el ID del usuario de la URL si estamos en modo edición
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id')); // Obtener el ID de la URL (ruta 'users/edit/:id')
      if (this.userId && !isNaN(this.userId)) {
        this.isEditMode = true; // Estamos en modo edición
        this.userService.getUserById(this.userId).subscribe({
          next: (user) => {
            // Rellenar el formulario con los datos del usuario si lo encontramos
            this.userForm.patchValue(user);
          },
          error: (err) => {
            console.error('Error al cargar usuario para edición:', err);
            alert('No se pudo cargar el usuario para edición.');
            this.router.navigate(['/users']); // Volver a la lista si hay un error
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value; // Obtener los valores del formulario
      if (this.isEditMode && this.userId) {
        // Modo edición: actualizar usuario existente
        this.userService.updateUser(this.userId, user).subscribe({
          next: () => {
            alert('Usuario actualizado con éxito');
            this.router.navigate(['/users']); // Navegar de vuelta a la lista
          },
          error: (err) => {
            console.error('Error al actualizar usuario:', err);
            alert('Error al actualizar el usuario.');
          }
        });
      } else {
        // Modo creación: crear nuevo usuario
        this.userService.createUser(user).subscribe({
          next: () => {
            alert('Usuario creado con éxito');
            this.router.navigate(['/users']); // Navegar de vuelta a la lista
          },
          error: (err) => {
            console.error('Error al crear usuario:', err);
            alert('Error al crear el usuario.');
          }
        });
      }
    } else {
      alert('Por favor, completa el formulario correctamente.');
    }
  }

  // Método para cancelar y volver a la lista
  onCancel(): void {
    this.router.navigate(['/users']);
  }
}