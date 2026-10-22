export interface SortState {
  active: string;
  direction: '' | 'asc' | 'desc';
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface DatatableState extends PaginationState {
  sort: SortState;
  search: string;
}
