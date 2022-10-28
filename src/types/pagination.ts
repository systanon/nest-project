export interface Pagination {
  offset?: number;
  limit?: number;
  sort?: { field: string; by: 'ASC' | 'DESC' }[];
  search?: { field: string; value: string }[];
}
