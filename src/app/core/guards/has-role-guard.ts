import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Guard que valida si el usuario tiene los roles necesarios para acceder a una ruta específica.
 * Si el usuario no tiene los roles requeridos, redirige al usuario a la página de error 403.
 * @param roles Lista de roles permitidos para acceder a la ruta.
 */
export const hasRoleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const hasPermission = authService
      .getRoles()
      .some((role) => roles.includes(role));

    if (!hasPermission) {
      return router.createUrlTree(['/403']);
    }

    return true;
  };
};