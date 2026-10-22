import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../error/ErrorResponse';
import { inject } from '@angular/core';
import { NotificationService } from '../../shared/services/notification';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status !== 0) {
          const data = error.error;
          if (error.status === 403) {
            notificationService.error(
              'No cuentas con los permisos necesarios para acceder a este recurso.',
            );
            router.navigate(['/403']);
          }
          return throwError(() => new ApiError(data));
        }
        return throwError(
          () =>
            new ApiError({
              status: 0,
              title: 'Error de conexión',
              detail: 'No se pudo conectar con el servidor.',
              code: 'NETWORK_ERROR',
            }),
        );
      } else {
        return throwError(() => error);
      }
    }),
  );
};
