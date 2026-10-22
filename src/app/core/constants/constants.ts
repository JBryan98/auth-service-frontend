import { DatatableState, SortState } from '../interface/datatable';

export const PASSWORD = {
  PATTERN: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  MESSAGE:
    'La contraseña debe tener al menos 8 caracteres e incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_INDEX: 0,
  DEFAULT_PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

export const DEFAULT_DATATABLE_STATE: DatatableState = {
  pageIndex: PAGINATION.DEFAULT_PAGE_INDEX,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  search: '',
  sort: {
    active: '',
    direction: '',
  } as SortState,
};
