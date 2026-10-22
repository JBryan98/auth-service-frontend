import { HttpParams, httpResource } from '@angular/common/http';
import { Service, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/interface/api-response';
import { Role } from '../interface/role';

@Service()
export class RoleService {
  baseUrl = `${environment.apiUrl}/roles`;

  getRoles(params?: Signal<HttpParams>) {
    return httpResource<PaginatedResponse<Role>>(() => {
      return {
        url: this.baseUrl,
        params: params ? params() : undefined,
      };
    });
  }
}
