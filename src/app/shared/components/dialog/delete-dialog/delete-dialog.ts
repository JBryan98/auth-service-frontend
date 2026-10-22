import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { EMPTY, catchError, finalize } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { Alert } from '../../alert/alert';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../../services/notification';
import { DeleteDialogData } from '../../../interfaces/dialog';

@Component({
  selector: 'app-delete-dialog',

  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    Alert,
  ],
  styleUrl: './delete-dialog.css',
  templateUrl: './delete-dialog.html',
})
export class DeleteDialog {
  readonly data = inject<DeleteDialogData>(MAT_DIALOG_DATA);
  private readonly notificationService = inject(NotificationService);

  private readonly dialogRef = inject(MatDialogRef<DeleteDialog, boolean>);

  readonly loading = signal(false);

  cancel(): void {
    if (this.loading()) {
      return;
    }

    this.dialogRef.close(false);
  }

  confirm(): void {
    /**
     * Confirmación únicamente client-side.
     */
    if (!this.data.action) {
      this.dialogRef.close(true);
      return;
    }

    /**
     * Operación async / server-side.
     */
    this.loading.set(true);

    this.data
      .action()
      .pipe(
        catchError((error) => {
          this.notificationService.error(error.message || 'Hubo un error al eliminar el recurso.');
          return EMPTY;
        }),

        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
      });
  }
}
