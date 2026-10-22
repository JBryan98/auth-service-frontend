import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarData {
  message: string;
  type: SnackbarType;
}

@Component({
  imports: [MatIconModule, MatButtonModule],
  selector: 'app-snackbar',
  styleUrl: './snackbar.css',
  templateUrl: './snackbar.html',
})
export class Snackbar {
  readonly data = inject<SnackbarData>(MAT_SNACK_BAR_DATA);
  readonly snackBarRef = inject(MatSnackBarRef<Snackbar>);

  getIcon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }
}
