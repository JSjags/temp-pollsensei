export interface GenericApiResponse {
  status: boolean;
  message: string;
  errors?: string[];
}

export interface GenericPaginatedResponse<T> {
  data: T[];
  page: number;
  total: number;
  page_size: number;
}

export interface GenericPaginatedRequest {
  pageNumber?: number;
}

export interface GenericTypeWithId<T> {
  value: T;
  id: string;
}
