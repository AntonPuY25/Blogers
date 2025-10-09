import { PaginationAndSorting } from "../../core/types/pagintaion-types";
import { SortFieldsForComments } from "../../blogs/routers/sort-fields";


export interface GetAllCommentsForCurrentPostProps
  extends PaginationAndSorting<SortFieldsForComments> {
  postId: string;
}
