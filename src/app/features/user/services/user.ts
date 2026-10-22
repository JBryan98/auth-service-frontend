import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/interface/api-response';
import {
  ChangePasswordRequest,
  CreateUserRequest,
  RestoreUserPasswordRequest,
  UpdateUserRequest,
  User,
} from '../interfaces/user';

@Service()
export class UserService {
  baseUrl = `${environment.apiUrl}/users`;
  http = inject(HttpClient);

  getUsers(params: Signal<HttpParams>) {
    return httpResource<PaginatedResponse<User>>(() => {
      return {
        url: this.baseUrl,
        params: params(),
      };
    });
  }

  getUserById(userId: number) {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }

  create(user: CreateUserRequest) {
    return this.http.post<User>(this.baseUrl, user);
  }

  update(userId: number, user: UpdateUserRequest) {
    return this.http.put<User>(`${this.baseUrl}/${userId}`, user);
  }

  changePassword(userId: number, request: ChangePasswordRequest) {
    return this.http.patch(`${this.baseUrl}/${userId}/change-password`, request);
  }

  restorePassword(userId: number, request: RestoreUserPasswordRequest) {
    return this.http.patch(`${this.baseUrl}/${userId}/reset-password`, request);
  }

  enable(userId: number) {
    return this.http.patch(`${this.baseUrl}/${userId}/enable`, {});
  }

  disable(userId: number) {
    return this.http.patch(`${this.baseUrl}/${userId}/disable`, {});
  }
}
