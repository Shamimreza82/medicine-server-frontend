export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
  meta?: ApiMeta;
}

export interface ApiErrorPayload {
  success: false;
  message: string;
  error?: unknown;
}
