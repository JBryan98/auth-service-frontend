import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, pattern, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PASSWORD } from '../../../../core/constants/constants';
import { LoginRequest } from '../../../../core/interface/auth';
import { AuthService } from '../../../../core/services/auth';
import { FormInput } from '../../../../shared/components/form/form-input/form-input';
import { NotificationService } from '../../../../shared/services/notification';

@Component({
  imports: [
    FormInput,
    FormField,
    FormRoot,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  selector: 'app-login-form',
  styleUrl: './login-form.css',
  templateUrl: './login-form.html',
})
export class LoginForm {
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  hidePassword = signal<boolean>(true);
  loginRequest = signal<LoginRequest>({
    username: '',
    password: '',
  });

  loginForm = form(this.loginRequest, (fieldPath) => {
    required(fieldPath.username, { message: 'El usuario es obligatorio.' });
    required(fieldPath.password, { message: 'La contraseña es obligatoria.' });
    pattern(fieldPath.password, PASSWORD.PATTERN, { message: PASSWORD.MESSAGE });
  });

  readonly isSubmitting = signal<boolean>(false);

  onSubmit(e: Event) {
    this.loginForm().markAsTouched();
    if (this.loginForm().invalid()) return;
    this.isSubmitting.set(true);
    this.authService
      .login(this.loginRequest())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          // Redirigir al usuario a la página original o a la página de inicio
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          if (error instanceof Error) {
            this.notificationService.error(error.message);
          } else {
            console.error('Unknown error:', error);
            this.notificationService.error('Ocurrió un error inesperado. Intenta nuevamente');
          }
        },
      });
  }
}
