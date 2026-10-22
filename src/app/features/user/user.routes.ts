import { nonBlocking, Routes } from '@angular/router';
import { hasRoleGuard } from '../../core/guards/has-role-guard';
import { Users } from './pages/users/users';
import { User } from './interfaces/user';
import { UserDetails } from './pages/user-details/user-details';
import { UserService } from './services/user';
import { inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

export const userRoutes: Routes = [
  {
    path: '',
    canActivate: [hasRoleGuard(['ROLE_ADMIN'])],
    data: {
      breadcrumb: {
        label: 'Usuarios',
      },
    },
    children: [
      {
        path: '',
        title: 'Usuarios',
        component: Users,
      },
      {
        path: ':id',
        title: 'Detalles de usuario',
        data: {
          breadcrumb: {
            resource: 'user',
            label: (user: User) => user.fullName,
          },
        },
        component: UserDetails,
        resources: (ctx) => {
          const userService = inject(UserService);
          return {
            user: nonBlocking(
              rxResource({
                params: () => ctx.params()['id'],
                stream: ({ params: id }) => {
                  const rawId = id;
                  if (isNaN(Number(rawId))) {
                    throw new Error(`El id '${rawId}' es inválido`);
                  }
                  return userService.getUserById(Number(id));
                },
              }),
            ),
          };
        },
      },
    ],
  },
];
