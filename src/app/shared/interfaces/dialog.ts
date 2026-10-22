import { Observable } from 'rxjs';

export interface ConfirmDialogData<TResult = unknown> {
  title?: string;
  message?: string;
  messageSeverity?: 'info' | 'warning' | 'error';
  action?: () => Observable<TResult>;
  confirmButtonText?: string;
  cancelButtonText?: string;
  errorMessage?: string;
}

export interface DeleteDialogData<TResult = unknown> {
  title?: string;

  /**
   * Mensaje principal del diálogo.
   */
  message?: string;

  /**
   * Acción que se ejecuta al confirmar.
   *
   * Si no se proporciona, funciona como
   * confirmación únicamente del cliente.
   */
  action?: () => Observable<TResult>;

  confirmText?: string;
  cancelText?: string;

  errorMessage?: string;
}
