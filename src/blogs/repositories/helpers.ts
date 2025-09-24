import {
  GetPagesCountProps,
  GetSkipPagesAndLimitForBlogPaginationProps,
} from "./types";

export const getSkipPagesAndLimitForBlogAndSortPagination = ({
  pageSize,
  pageNumber,
}: GetSkipPagesAndLimitForBlogPaginationProps) => {
  return {
    skip: pageNumber && pageSize ? Number((pageNumber - 1) * pageSize) : 0,
    limit: Number(pageSize) || 10,
  };
};

export const getPagesCount = ({ pageSize, totalCount }: GetPagesCountProps) => {
  return Math.ceil(totalCount / pageSize);
};
