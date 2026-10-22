import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, pattern, required, submit } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { PASSWORD } from '../../../../core/constants/constants';
import { FormDialog } from '../../../../shared/components/dialog/form-dialog/form-dialog';
import { FormInput } from '../../../../shared/components/form/form-input/form-input';
import { NotificationService } from '../../../../shared/services/notification';
import { RestoreUserPasswordRequest, User } from '../../interfaces/user';
import { UserService } from '../../services/user';

export interface RestoreUserPasswordDialogData {
  user: User;
}

@Component({
  imports: [FormDialog, FormRoot, FormField, FormInput],
  selector: 'app-restore-password-form',
  styleUrl: './restore-password-form.css',
  templateUrl: './restore-password-form.html',
})
export class RestorePasswordForm {
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogData = inject<RestoreUserPasswordDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RestorePasswordForm>);

  title = `Restaurar contraseña para '${this.dialogData.user.firstName} ${this.dialogData.user.lastName}'`;

  isSubmitting = signal<boolean>(false);
  formModel = signal<RestoreUserPasswordRequest>({
    newPassword: '',
  });

  form = form(this.formModel, (fieldPath) => {
    required(fieldPath.newPassword, { message: 'La nueva contraseña es requerida' });
    pattern(fieldPath.newPassword, PASSWORD.PATTERN, { message: PASSWORD.MESSAGE });
  });

  onSubmit() {
    this.form().markAsTouched();
    if (this.form().invalid()) return;
    submit(this.form, async (field) => {
      try {
        this.isSubmitting.set(true);
        const request = this.formModel();
        await lastValueFrom(this.userService.restorePassword(this.dialogData.user.id, request));
        this.dialogRef.close(true);
      } catch (error: any) {
        console.error('Error restoring password:', error);
        this.notificationService.error(error.message);
      } finally {
        this.isSubmitting.set(false);
      }
      return;
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
