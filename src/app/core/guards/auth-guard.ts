import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Guard que valida si el usuario está autenticado antes de permitir el acceso a rutas hijas.
 * Si el usuario no esta autenticado, redirige al usuario a la página de login y pasa la URL de retorno como parámetro de consulta.
 */
export const authGuard: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      returnUrl: state.url,
    },
  });
};
