import { SortFields } from "../../blogs/routers/sort-fields";
import { SortDirectionTypes } from "./sort-types";

export type PaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S | "createdAt";
  sortDirection: SortDirectionTypes;
};

export interface GetAppBlogsPaginationWithSortWithSearchQuery
  extends PaginationAndSorting<SortFields> {
  searchNameTerm?: string;
}

export interface GetAppPostsPaginationWithSortWithSearchQuery
  extends Omit<
    GetAppBlogsPaginationWithSortWithSearchQuery,
    "searchNameTerm"
  > {}
