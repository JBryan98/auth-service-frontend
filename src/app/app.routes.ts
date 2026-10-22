import { Routes } from '@angular/router';
import { App } from './app';
import { authGuard } from './core/guards/auth-guard';
import { rootRedirectGuard } from './core/guards/root-redirect-guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { PageHeaderLayout } from './core/layout/page-header-layout/page-header-layout';
import { Login } from './features/auth/pages/login/login';
import { Forbidden } from './features/errors/forbidden/forbidden';
import { NotFound } from './features/errors/not-found/not-found';
import { Home } from './features/home/pages/home/home';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [rootRedirectGuard],
    component: App,
  },
  {
    path: 'login',
    title: 'Login',
    component: Login,
  },
  {
    path: '',
    component: MainLayout,
    canActivateChild: [authGuard],
    children: [
      {
        path: 'home',
        title: 'Inicio',
        component: Home,
      },
      {
        path: '403',
        title: 'Acceso denegado',
        component: Forbidden,
      },
      {
        path: '',
        component: PageHeaderLayout,
        children: [
          {
            path: 'users',
            loadChildren: () => import('./features/user/user.routes').then((m) => m.userRoutes),
          },
        ],
      },
      {
        path: '**',
        title: 'Página no encontrada',
        component: NotFound,
      },
    ],
  },
];
