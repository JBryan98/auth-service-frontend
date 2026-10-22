import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ApiError } from '../error/ErrorResponse';
import { NotificationService } from '../../shared/services/notification';

let isRefreshing = false;
let isLoggingOut = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh-token') ||
    req.url.includes('/auth/logout')
  ) {
    return next(req);
  }

  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const accessToken = authService.getToken();
  const request = accessToken ? addTokenHeader(req, accessToken) : req;
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) return throwError(() => error);
      // Si el error es 401 y el código es EXPIRED_JWT, se refresca el token.
      if (error.error.code === 'EXPIRED_JWT') {
        return handleJwtExpired(req, next, authService, notificationService, router);
      } else {
        return handleForceLogout(authService, router, error, notificationService);
      }
    }),
  );
};

function addTokenHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handleJwtExpired(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  notificationService: NotificationService,
  router: Router,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);
    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        const newToken = response.accessToken;
        refreshTokenSubject.next(newToken);
        return next(addTokenHeader(req, newToken));
      }),
      catchError((error: HttpErrorResponse) => {
        // Si el refresh token ha expirado, fue revocado o es inválido, se fuerza el cierre de sesión.
        if (error.status === 401) {
          handleForceLogout(authService, router, error, notificationService);
        }
        return throwError(() => error);
      }),
      finalize(() => {
        isRefreshing = false;
      }),
    );
  } else {
    // La cola de solicitudes espera a que se complete la solicitud de refresh token y luego reintenta la solicitud original con el nuevo token
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addTokenHeader(req, token!))),
    );
  }
}

/**
 * Método que se encarga de manejar el cierre de sesión forzado cuando el refresh token ha expirado o es inválido.
 * Cierra la sesión local y redirige al usuario a la página de login.
 */
function handleForceLogout(
  authService: AuthService,
  router: Router,
  error: HttpErrorResponse,
  notificationService: NotificationService,
) {
  const apiError = error.error as ApiError;
  // Este error se maneja en el cliente, no se requiere cerrar sesión ni refrescar token.
  // Nota: BAD_CREDENTIALS no solo ocurre en el login, tambien ocurre en ChangePassword, por lo que no se debe cerrar sesión en ese caso.
  if (apiError.code === 'BAD_CREDENTIALS') {
    return throwError(() => new ApiError(apiError));
  }

  // Cierra sesión local incluso si el logout(revocar el refresh token) del backend falla.
  authService.removeSession();
  notificationService.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
  if (!isLoggingOut) {
    isLoggingOut = true;
    authService
      .logout()
      .pipe(
        finalize(() => {
          isLoggingOut = false;
        }),
      )
      .subscribe({
        next: () => {
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        },
        error: () => {
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        },
      });
  } else if (!isLoggingOut) {
    router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
  }

  return throwError(() => error);
}
