import {
  GetAppBlogsPaginationWithSortWithSearchQuery,
  PaginationAndSorting,
} from "../../core/types/pagintaion-types";

export interface GetAllBlogsTypeForRepositories
  extends GetAppBlogsPaginationWithSortWithSearchQuery {}

export interface GetSkipPagesAndLimitForBlogPaginationProps
  extends Pick<PaginationAndSorting<string>, "pageNumber" | "pageSize"> {}

export interface GetPagesCountProps {
  totalCount: number;
  pageSize: number;
}
