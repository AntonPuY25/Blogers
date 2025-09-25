import { CreatePostRequest } from "../../core/types/routers-types";
import { GetAppPostsPaginationWithSortWithSearchQuery } from "../../core/types/pagintaion-types";

export interface GetAllPostsForCurrentBlogProps
  extends GetAppPostsPaginationWithSortWithSearchQuery {
  blogId: string;
}

export interface CreatePostForCurrentBlogProps
  extends Omit<CreatePostRequest, "blogId"> {}
