import { HttpParams } from '@angular/common/http';
import { computed, Service, Signal } from '@angular/core';
import { ParamMap } from '@angular/router';
import { DEFAULT_DATATABLE_STATE } from '../../../core/constants/constants';
import { BasePagedFilterService } from '../../../shared/services/base-paged-filter';
import { UserFilter } from '../interfaces/user';
import { userColumns } from '../pages/users/user-columns';

const defaultValues: UserFilter = {
  ...DEFAULT_DATATABLE_STATE,
  roleIds: [],
  enabled: null,
};

@Service()
export class UserFilterService extends BasePagedFilterService<UserFilter> {
  /**
   * Params limpios, que no incluyen los valores por defecto, para poder ser usados en la URL o en la API.
   */
  override serializedParams: Signal<HttpParams> = computed(() => {
    const currentState = this.filterState();
    let params = this.getDatatableSerializedParams(currentState);
    const { roleIds, enabled } = currentState;
    if (roleIds.length > 0) {
      params = params.set('roleIds', roleIds.join(','));
    }
    if (enabled !== null) {
      params = params.set('enabled', enabled!.toString());
    }
    return params;
  });

  constructor() {
    const sortColumns = userColumns.filter((col) => col.sortable).map((col) => col.key);
    super(defaultValues, sortColumns);
  }

  protected override parseQuery(params: ParamMap): UserFilter {
    const dataTableQuery = this.getDataTableQuery(params);
    return {
      ...dataTableQuery,
      roleIds: this.parseRoleIds(params.get('roleIds')),
      enabled: this.parseEnabled(params.get('enabled')),
    };
  }

  private parseRoleIds(rawRoleIds: string | null): number[] {
    if (!rawRoleIds) return [];
    const validIds = rawRoleIds
      .split(',')
      .map((val) => +val.trim())
      .filter((num) => !Number.isNaN(num) && Number.isInteger(num) && num > 0);
    return Array.from(new Set(validIds));
  }

  private parseEnabled(rawEnabled: string | null): boolean | null {
    if (!rawEnabled) return null;
    const lowerActive = rawEnabled.toLowerCase();
    if (lowerActive === 'true') return true;
    if (lowerActive === 'false') return false;
    return null;
  }
}
