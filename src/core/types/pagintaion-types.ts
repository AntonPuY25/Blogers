import { SortDirection } from "mongodb";
import { SortFields } from "../../blogs/routers/sort-fields";

export type PaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S | "createdAt";
  sortDirection: SortDirection;
};

export interface GetAppBlogsPaginationWithSortWithSearchQuery
  extends Partial<PaginationAndSorting<SortFields>> {
  searchNameTerm?: string;
}

export interface GetAppPostsPaginationWithSortWithSearchQuery
  extends Omit<
    GetAppBlogsPaginationWithSortWithSearchQuery,
    "searchNameTerm"
  > {}
