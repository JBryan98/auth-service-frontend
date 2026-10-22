import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../../../../features/user/services/user';
import { FormDialog } from '../../../../shared/components/dialog/form-dialog/form-dialog';
import { FormInput } from '../../../../shared/components/form/form-input/form-input';
import { PASSWORD } from '../../../constants/constants';
import { ApiError } from '../../../error/ErrorResponse';

export type ChangePasswordFormDialogData = {
  userId: number;
};

type ChangePasswordModel = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

@Component({
  imports: [FormRoot, FormInput, FormField, FormDialog],
  selector: 'app-change-password-form',
  styleUrl: './change-password-form.css',
  templateUrl: './change-password-form.html',
})
export class ChangePasswordForm {
  private readonly dialogRef = inject(MatDialogRef<ChangePasswordForm>);
  private readonly userService = inject(UserService);
  private dialogData = inject<ChangePasswordFormDialogData>(MAT_DIALOG_DATA);

  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  changePasswordModel = signal<ChangePasswordModel>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  changePasswordForm = form(this.changePasswordModel, (fieldPath) => {
    required(fieldPath.currentPassword, { message: 'La contraseña actual es obligatoria.' });
    required(fieldPath.newPassword, { message: 'La nueva contraseña es obligatoria.' });
    required(fieldPath.confirmPassword, { message: 'La confirmación es obligatoria.' });
    pattern(fieldPath.currentPassword, PASSWORD.PATTERN, { message: PASSWORD.MESSAGE });
    pattern(fieldPath.newPassword, PASSWORD.PATTERN, { message: PASSWORD.MESSAGE });
    pattern(fieldPath.confirmPassword, PASSWORD.PATTERN, { message: PASSWORD.MESSAGE });
    validate(fieldPath.newPassword, ({ value, valueOf }) => {
      const currentPasswordValue = valueOf(fieldPath.currentPassword);
      if (value() === currentPasswordValue) {
        return {
          kind: 'password-same-as-current',
          message: 'La nueva contraseña no puede ser igual a la actual.',
        };
      }
      return null;
    });
    validate(fieldPath.confirmPassword, ({ value, valueOf }) => {
      const newPasswordValue = valueOf(fieldPath.newPassword);
      if (value() !== newPasswordValue) {
        return {
          kind: 'password-mismatch',
          message: 'Las contraseña no coincide con la nueva contraseña.',
        };
      }
      return null;
    });
  });

  onSubmit() {
    this.changePasswordForm().markAsTouched();
    if (this.changePasswordForm().invalid()) return;

    submit(this.changePasswordForm, async (field) => {
      this.isSubmitting.set(true);
      try {
        const { confirmPassword, ...changePasswordRequest } = this.changePasswordModel();
        const userId = this.dialogData.userId;
        await lastValueFrom(this.userService.changePassword(userId, changePasswordRequest));
        this.dialogRef.close({ success: true });
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.code === 'BAD_CREDENTIALS') {
            this.changePasswordForm.currentPassword().focusBoundControl();
            return {
              kind: 'server',
              message: 'La contraseña actual es incorrecta.',
              fieldTree: field.currentPassword,
            };
          } else {
            return { kind: 'server', message: error.message };
          }
        }
        this.errorMessage.set('Ocurrio un error inesperado. Intenta nuevamente.');
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
