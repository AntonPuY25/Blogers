import { PaginationAndSorting } from "../../core/types/pagintaion-types";
import { SortFieldsForComments } from "../../blogs/routers/sort-fields";

export interface CreateCommentForPostProps {
  content: string;
}

export interface GetPaginationAndSortForPostsAndComments
  extends Partial<PaginationAndSorting<SortFieldsForComments>> {}
