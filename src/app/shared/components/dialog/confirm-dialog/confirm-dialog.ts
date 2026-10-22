import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ConfirmDialogData } from '../../../interfaces/dialog';
import { NotificationService } from '../../../services/notification';
import { Alert } from '../../alert/alert';

@Component({
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    Alert,
  ],
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.css',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  readonly isLoading = signal<boolean>(false);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialog, boolean>);
  private readonly notificationService = inject(NotificationService);

  cancel(): void {
    if (this.isLoading()) {
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
    this.isLoading.set(true);

    this.data
      .action()
      .pipe(
        catchError((error) => {
          this.notificationService.error(error.message || "Hubo un error al procesar la acción.");
          return EMPTY;
        }),

        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
      });
  }
}
