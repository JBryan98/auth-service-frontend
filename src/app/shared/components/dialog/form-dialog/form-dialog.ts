import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogContent,
    MatDialogActions,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-form-dialog',
  styleUrl: './form-dialog.css',
  templateUrl: './form-dialog.html',
})
export class FormDialog {
  dialogRef = inject(MatDialogRef);
  title = input.required<string>();
  cancelText = input<string>('Cancelar');
  confirmText = input<string>('Aceptar');
  isSubmitting = input<boolean>(false);
  isError = input<boolean>(false);
  isLoading = input<boolean>(false);
  loadingText = input<string>('Cargando...');

  confirm = output<void>();
  cancel = output<void>();

  onClose(event: Event) {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
