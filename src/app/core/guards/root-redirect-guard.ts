import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

/**
 * La aplicación no utiliza una ruta raíz "/", por lo que este guard se utiliza para redirigir a los usuarios a la ruta adecuada según su estado de autenticación.
 * @returns Una URL de redirección a "/home" si el usuario está autenticado, o a "/login" si no lo está.
 */
export const rootRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.parseUrl('/home');
  } else {
    return router.parseUrl('/login');
  }
};
