import {CreatePostRequest} from "../../core/types/routers-types";
import {GetAppPostsPaginationWithSortWithSearchQuery} from "../../core/types/pagintaion-types";
import { PostType } from "../../core/types/db-types";
import { ObjectId } from "mongodb";

export interface GetAllPostsForCurrentBlogProps
  extends GetAppPostsPaginationWithSortWithSearchQuery {
  blogId: string;
}

export interface CreatePostForCurrentBlogProps
  extends Omit<CreatePostRequest, "blogId"> {}

export interface CreatePostWithObjectId extends PostType {
  _id: ObjectId;
}