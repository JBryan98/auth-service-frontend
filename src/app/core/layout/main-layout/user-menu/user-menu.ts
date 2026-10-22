import { Component, inject } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ModalService } from '../../../../shared/services/modal';
import { NotificationService } from '../../../../shared/services/notification';
import { AuthService } from '../../../services/auth';
import {
  ChangePasswordForm,
  ChangePasswordFormDialogData,
} from '../change-password-form/change-password-form';

@Component({
  imports: [MatButtonModule, MatIconModule, MatIconButton, MatMenuModule],
  selector: 'app-user-menu',
  styleUrl: './user-menu.css',
  templateUrl: './user-menu.html',
})
export class UserMenu {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  private readonly notificationService = inject(NotificationService);

  avatarTxt = this.authService.getUserProfile()!.firstName.charAt(0).toUpperCase();

  changePassword() {
    this.modalService
      .open<ChangePasswordForm, ChangePasswordFormDialogData, { success: boolean } | undefined>(
        ChangePasswordForm,
        { userId: this.authService.getUserProfile()!.id },
      )
      .subscribe((response) => {
        if (response?.success) {
          this.notificationService.success('Contraseña actualizada exitosamente.');
        }
      });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login'], { replaceUrl: true });
      },
    });
  }
}
