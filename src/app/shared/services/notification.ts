import { inject, Service } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Snackbar, SnackbarType } from '../components/snackbar/snackbar';

@Service()
export class NotificationService {
  private readonly _snackBar = inject(MatSnackBar);

  private show(message: string, type: SnackbarType) {
    this._snackBar.openFromComponent(Snackbar, {
      data: { message, type },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`],
    });
  }

  success(message: string) {
    this.show(message, 'success');
  }
  error(message: string) {
    this.show(message, 'error');
  }
  warning(message: string) {
    this.show(message, 'warning');
  }
  info(message: string) {
    this.show(message, 'info');
  }
}
