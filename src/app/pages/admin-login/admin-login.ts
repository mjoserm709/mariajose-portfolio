import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Atencion', 'Revisa los campos antes de continuar.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.login(this.form.value.email ?? '', this.form.value.password ?? '').subscribe({
      next: () => {
        this.toastService.success('Exito', 'Sesion iniciada correctamente.');
        void this.router.navigate(['/admin/projects']);
      },
      error: () => {
        this.errorMessage.set('No se pudo iniciar sesion. Revisa tus credenciales.');
        this.toastService.error('Error al iniciar sesion', 'Revisa tus credenciales e intenta nuevamente.');
        this.isSubmitting.set(false);
      },
    });
  }
}
