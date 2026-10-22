export interface PaginatedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  status: number;
  title: string;
  detail: string;
  code: string;
  errors?: ErrorResponseErrors[];
}

export interface ErrorResponseErrors {
  pointer: string;
  detail: string;
}