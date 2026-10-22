import { ComponentType } from '@angular/cdk/overlay';
import { inject, Service } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Service()
export class ModalService {
  private readonly _dialog = inject(MatDialog);

  /**
   * Abre un modal genérico y retorna un Observable con el resultado al cerrar.
   * @param component Componente standalone que se renderizará dentro del modal.
   * @param data Datos de entrada opcionales (payload para edición, etc.).
   * @param config Configuraciones personalizadas de Material Dialog (ancho, posición, etc.).
   */
  open<TComponent, TData = unknown, TResult = unknown>(
    component: ComponentType<TComponent>,
    data?: TData,
    config?: MatDialogConfig<TData>,
  ): Observable<TResult | undefined> {
    const dialogRef: MatDialogRef<TComponent, TResult> = this._dialog.open(component, {
      width: '600px',
      disableClose: true,
      autoFocus: 'input',
      ...config,
      data,
    });

    return dialogRef.afterClosed();
  }
}
