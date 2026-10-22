import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom, of } from 'rxjs';
import { PASSWORD } from '../../../../core/constants/constants';
import { ApiError } from '../../../../core/error/ErrorResponse';
import { Alert } from '../../../../shared/components/alert/alert';
import { FormDialog } from '../../../../shared/components/dialog/form-dialog/form-dialog';
import { FormInput } from '../../../../shared/components/form/form-input/form-input';
import { FormSelectMultiple } from '../../../../shared/components/form/form-select-multiple/form-select-multiple';
import { NotificationService } from '../../../../shared/services/notification';
import { Role } from '../../../roles/interface/role';
import { CreateUserRequest, User } from '../../interfaces/user';
import { UserService } from '../../services/user';

export interface CreateEditFormDialogData {
  userId?: number;
  roles: Role[];
}

@Component({
  imports: [
    FormField,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    FormDialog,
    FormInput,
    FormSelectMultiple,
    FormRoot,
    Alert,
  ],
  selector: 'app-create-edit-form',
  styleUrl: './create-edit-form.css',
  templateUrl: './create-edit-form.html',
})
export class CreateEditForm implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CreateEditForm>);
  private readonly dialogData = inject<CreateEditFormDialogData>(MAT_DIALOG_DATA);
  private readonly userService = inject(UserService);
  private notificationService = inject(NotificationService);

  userResource = rxResource<User | null, number | undefined>({
    params: () => this.dialogData.userId,
    stream: ({ params: userId }) => {
      if (!userId) return of(null);
      return this.userService.getUserById(userId);
    },
  });

  title = 'Crear Usuario';
  isEditForm = false;
  requestModel = signal<CreateUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    roleIds: [],
  });
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = form(this.requestModel, (fieldPath) => {
    required(fieldPath.firstName, { message: 'El nombre es obligatorio.' });
    required(fieldPath.lastName, { message: 'El apellido es obligatorio.' });
    required(fieldPath.email, { message: 'El email es obligatorio.' });
    email(fieldPath.email, { message: 'El formato del email no es válido.' });
    minLength(fieldPath.roleIds, 1, { message: 'Debe seleccionar al menos un rol.' });
    if (!this.dialogData.userId) {
      required(fieldPath.username, { message: 'El nombre de usuario es obligatorio.' });
      required(fieldPath.password, { message: 'La contraseña es obligatoria.' });
      pattern(fieldPath.password, PASSWORD.PATTERN, { message: PASSWORD.MESSAGE });
    }
  });

  ngOnInit() {
    if (this.dialogData.userId) {
      this.title = 'Editar Usuario';
      this.isEditForm = true;
    }
  }

  constructor() {
    effect(() => {
      if (!this.userResource.hasValue()) return;
      const user = this.userResource.value();
      if (!user) return;
      this.requestModel.update((prev) => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleIds: user.roles.map((role) => role.id),
      }));
    });
  }

  onSubmit() {
    this.form().markAsTouched();
    if (this.form().invalid()) return;
    submit(this.form, async (field) => {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      try {
        const { username, password, ...updateRequest } = this.requestModel();
        const response = this.dialogData.userId
          ? await lastValueFrom(this.userService.update(this.dialogData.userId, updateRequest))
          : await lastValueFrom(this.userService.create(this.requestModel()));
        this.dialogRef.close(response);
      } catch (error: any) {
        if (error instanceof ApiError) {
          if (error.code === 'DUPLICATED_USERNAME') {
            // Hace focus sobre el field
            this.form.username().focusBoundControl();
            return {
              kind: 'serverError',
              message: error.message,
              fieldTree: field.username,
            };
          } else if (error.code === 'DUPLICATED_EMAIL') {
            this.form.username().focusBoundControl();
            return { kind: 'serverError', message: error.message, fieldTree: field.email };
          } else {
            this.notificationService.error(error.message);
            return { kind: 'serverError', message: error.message };
          }
        }
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
