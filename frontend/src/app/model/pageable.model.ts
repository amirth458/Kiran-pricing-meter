export interface Pageable<T> {
  number: number;
  content: T[];
  pageable: string;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  size: number;
  numberOfElements: number;
  empty: boolean;
}
