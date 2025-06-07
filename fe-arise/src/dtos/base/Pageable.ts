export type Pageable<T> = {
  totalPages: number;
  totalElements: number;
  pageable: PageableInfo;
  size: number;
  content: T[];
  number: number;
  sort: Sort[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type PageableInfo = {
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort[];
  paged: boolean;
  unpaged: boolean;
};

export type Sort = {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
};

export const emptyPageable = <T>(): Pageable<T> => ({
  totalPages: 0,
  totalElements: 0,
  pageable: {
    pageNumber: 0,
    pageSize: 0,
    offset: 0,
    sort: [],
    paged: false,
    unpaged: true,
  },
  size: 0,
  content: [],
  number: 0,
  sort: [],
  first: true,
  last: true,
  numberOfElements: 0,
  empty: true,
});
