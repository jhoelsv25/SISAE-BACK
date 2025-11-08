export type Response<T> = {
  message: string;
  data: T | null;
};
export type PaginatedResponse<T> = {
  data: T[] | [];
  page: number;
  size: number;
  total: number;
};
