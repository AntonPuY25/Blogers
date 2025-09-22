import { GetSkipPagesAndLimitForBlogPaginationProps } from "./types";

export const getSkipPagesAndLimitForBlogPagination = ({
  pageSize,
  pageNumber,
}: GetSkipPagesAndLimitForBlogPaginationProps) => {
  return {
    skip: pageNumber && pageSize ? Number((pageNumber - 1) * pageSize) : 0,
    limit: Number(pageSize) || 10,
  };
};
