import {
  GetAppBlogsPaginationWithSortWithSearchQuery,
  PaginationAndSorting,
} from "../../core/types/pagintaion-types";

export interface GetAllBlogsTypeForRepositories
  extends GetAppBlogsPaginationWithSortWithSearchQuery {}

export interface GetSkipPagesAndLimitForBlogPaginationProps
  extends Partial<
    Pick<PaginationAndSorting<string>, "pageNumber" | "pageSize">
  > {}
