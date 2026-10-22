import { DatatableState } from '../../../core/interface/datatable';
import { Role } from '../../roles/interface/role';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  fullName: string;
  admin: boolean;
  roles: Role[];
  enabled: boolean;
}

export interface UserFilter extends DatatableState {
  roleIds: number[];
  enabled: boolean | null;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  roleIds: number[];
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  roleIds: number[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RestoreUserPasswordRequest {
  newPassword: string;
}
