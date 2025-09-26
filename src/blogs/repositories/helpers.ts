import {
  GetPagesCountProps,
  GetSkipPagesAndLimitForBlogPaginationProps,
} from "./types";
import { PaginationAndSorting } from "../../core/types/pagintaion-types";
import { paginationAndSortingDefault } from "../../core/middlewares/sort-and-pagination-middleware";

export const getSkipPagesAndLimitForBlogAndSortPagination = ({
  pageSize,
  pageNumber,
}: GetSkipPagesAndLimitForBlogPaginationProps) => {
  return {
    skip:  Number((pageNumber - 1) * pageSize),
    limit: Number(pageSize),
  };
};

export const getPagesCount = ({ pageSize, totalCount }: GetPagesCountProps) => {
  return Math.ceil(totalCount / pageSize);
};

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}