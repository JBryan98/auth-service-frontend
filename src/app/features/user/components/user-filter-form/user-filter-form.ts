import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { form, FormField, FormRoot, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterDrawer } from '../../../../shared/components/drawer/filter-drawer/filter-drawer';
import { FormSelectBoolean } from '../../../../shared/components/form/form-select-boolean/form-select-boolean';
import { FormSelectMultiple } from '../../../../shared/components/form/form-select-multiple/form-select-multiple';
import { UserFilterService } from '../../services/user-filter';
import { Role } from '../../../roles/interface/role';

@Component({
  imports: [FormRoot, FormField, FormSelectMultiple, FormSelectBoolean, FilterDrawer],
  selector: 'app-user-filter-form',
  styleUrl: './user-filter-form.css',
  templateUrl: './user-filter-form.html',
})
export class UserFilterForm {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly userFilterService = inject(UserFilterService);
  opened = model.required<boolean>();
  roles = input.required<Role[]>();

  filterModel = signal({
    roleIds: this.userFilterService.filterState().roleIds,
    enabled: this.userFilterService.filterState().enabled,
  });

  disableClearButton = computed(() => !this.userFilterService.canClean());

  hasFilters = computed(
    () => this.filterModel().roleIds.length > 0 || this.filterModel().enabled !== null,
  );

  form = form(this.filterModel);

  constructor() {
    // Mantener en sincronía el estado del formulario con el estado del servicio de filtros.
    effect(() => {
      const currentState = this.userFilterService.filterState();
      this.filterModel.set({
        roleIds: currentState.roleIds,
        enabled: currentState.enabled,
      });
    });
  }

  onSubmit() {
    submit(this.form, async (field) => {
      const filterByRoles = field.roleIds().value().length > 0;
      const filterByActive = field.enabled().value() !== null;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: this.hasFilters() ? null : undefined,
          roleIds: filterByRoles ? field.roleIds().value().join(',') : null,
          enabled: filterByActive ? field.enabled().value() : null,
        },
        queryParamsHandling: 'merge',
      });
    });
  }

  onClear() {
    this.userFilterService.cleanFilters();
  }
}
