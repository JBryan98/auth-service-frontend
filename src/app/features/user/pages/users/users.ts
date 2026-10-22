import { Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { withPreviousValue } from '../../../../core/utils/with-previous-value';
import { Datatable } from '../../../../shared/components/table/datatable/datatable';
import { PaginatedResourceMutation } from '../../../../shared/pagination/paginated-resource-mutation';
import { BooleanPipe } from '../../../../shared/pipe/boolean-pipe';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog';
import { ModalService } from '../../../../shared/services/modal';
import { NotificationService } from '../../../../shared/services/notification';
import { RoleService } from '../../../roles/services/role-service';
import {
  CreateEditForm,
  CreateEditFormDialogData,
} from '../../components/create-edit-form/create-edit-form';
import {
  RestorePasswordForm,
  RestoreUserPasswordDialogData,
} from '../../components/restore-password-form/restore-password-form';
import { UserFilterForm } from '../../components/user-filter-form/user-filter-form';
import { User, UserFilter } from '../../interfaces/user';
import { UserService } from '../../services/user';
import { UserFilterService } from '../../services/user-filter';
import { userColumns } from './user-columns';

@Component({
  imports: [
    BooleanPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    Datatable,
    MatInputModule,
    UserFilterForm,
    RouterLink,
  ],
  selector: 'app-users',
  styleUrl: './users.css',
  templateUrl: './users.html',
})
export class Users {
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly modalService = inject(ModalService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly filterService = inject(UserFilterService);
  private readonly userMutations = new PaginatedResourceMutation<User>(
    (user) => user.id,
    (pageIndex) => this.filterService.navigateToPage(pageIndex),
  );

  // Estado para abrir/cerrar el drawer lateral de filtros
  openFilters = signal<boolean>(false);

  // Filtros de usuario incluye paginacion, sorting y búsqueda
  userFilter: Signal<UserFilter> = this.filterService.filterState;
  canClearFilters: Signal<boolean> = computed(() => this.filterService.canClean());

  // Tabla de paginación y ordenamiento
  columns = userColumns;

  // Roles para filtros
  rolesResource = this.roleService.getRoles();

  /**
   * Resource para manejar la lista de usuarios paginados.
   * Este resource es la fuente de datos y las mutaciones se hacen sobre este.
   */
  private usersResource = this.userService.getUsers(this.filterService.serializedParams);

  /**
   * Wrapper del resource original.
   * Este resource permite manejar refetching manteniendo el valor previo mientras se carga uno nuevo.
   * Este resource es de solo lectura y no se deben hacer mutaciones sobre este, sino sobre el resource original.
   * El datatable trabaja con este resource.
   */
  readonly usersData = withPreviousValue(this.usersResource);

  isLoadingUsers = computed(() => this.usersData.isLoading() && !this.usersData.hasValue());
  isRefetchingUsers = computed(() => this.usersData.isLoading() && this.usersData.hasValue());

  constructor() {
    effect(() => {
      const rolesError = this.rolesResource.error();
      if (rolesError) {
        this.notificationService.error(`Error al cargar roles: ${rolesError.message}`);
      }
    });
  }

  createUser() {
    this.modalService
      .open<CreateEditForm, CreateEditFormDialogData, User>(CreateEditForm, {
        roles: this.rolesResource.hasValue() ? this.rolesResource.value().content : [],
      })
      .subscribe((createdUser) => {
        if (createdUser) {
          this.userMutations.add(this.usersResource, createdUser);
          this.notificationService.success('Usuario creado con éxito.');
        }
      });
  }

  editUser(userId: number) {
    this.modalService
      .open<CreateEditForm, CreateEditFormDialogData, User>(CreateEditForm, {
        userId,
        roles: this.rolesResource.hasValue() ? this.rolesResource.value().content : [],
      })
      .subscribe((updatedUser) => {
        if (updatedUser) {
          this.userMutations.update(this.usersResource, updatedUser);
          this.notificationService.success('Usuario actualizado con éxito.');
        }
      });
  }

  restorePassword(user: User) {
    this.modalService
      .open<RestorePasswordForm, RestoreUserPasswordDialogData, boolean>(RestorePasswordForm, {
        user,
      })
      .subscribe((restored) => {
        if (restored) {
          this.notificationService.success('Contraseña restaurada con éxito.');
        }
      });
  }

  enableUser(user: User) {
    this.confirmDialogService
      .open({
        title: `Habilitar usuario '${user.firstName} ${user.lastName}'`,
        message: 'El usuario podrá iniciar sesión nuevamente y acceder a la aplicación.',
        confirmButtonText: 'Habilitar',
        cancelButtonText: 'Cancelar',
        action: () => this.userService.enable(user.id),
      })
      .subscribe((enabled) => {
        if (!enabled) return;
        this.userMutations.update(this.usersResource, { ...user, enabled: true });
        this.notificationService.success('Usuario habilitado con éxito.');
      });
  }

  disableUser(user: User) {
    this.confirmDialogService
      .open({
        title: `Deshabilitar usuario '${user.firstName} ${user.lastName}'`,
        message: 'El usuario no podrá iniciar sesión ni acceder a la aplicación.',
        messageSeverity: 'warning',
        confirmButtonText: 'Deshabilitar',
        cancelButtonText: 'Cancelar',
        action: () => this.userService.disable(user.id),
      })
      .subscribe((disabled) => {
        if (!disabled) return;
        this.userMutations.update(this.usersResource, { ...user, enabled: false });
        this.notificationService.success('Usuario deshabilitado con éxito.');
      });
  }

  openFilterDrawer() {
    this.openFilters.set(true);
  }

  cleanFilters() {
    this.filterService.cleanFilters();
  }

  reloadRoles() {
    this.rolesResource.reload();
  }

  reloadUsers() {
    this.usersResource.reload();
  }
}
