export interface Filters {
  sort?: [string, 'asc' | 'desc'][];
  search?: { field: string; value: string }[];
}
