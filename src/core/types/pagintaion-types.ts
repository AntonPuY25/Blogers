import { SortDirection } from "mongodb";
import { BlogSortFields } from "../../blogs/routers/blog-sort-fields";

export type PaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S | 'createdAt';
  sortDirection: SortDirection;
};

export interface GetAppBlogsPaginationWithSortWithSearchQuery
  extends Partial<PaginationAndSorting<BlogSortFields>> {
  searchNameTerm?: string;
}
