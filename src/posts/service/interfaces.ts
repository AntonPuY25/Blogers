import { CreatePostRequest } from "../../core/types/routers-types";
import { GetAppPostsPaginationWithSortWithSearchQuery } from "../../core/types/pagintaion-types";
import { CreateCommentForPostProps } from "../routers/interface";

export interface GetAllPostsForCurrentBlogProps
  extends GetAppPostsPaginationWithSortWithSearchQuery {
  blogId: string;
}

export interface CreatePostForCurrentBlogProps
  extends Omit<CreatePostRequest, "blogId"> {}

export interface CreateCommentForPostFromServiceProps
  extends CreateCommentForPostProps {
  userId: string;
  userLogin: string;
  postId: string;
}

export interface CommentForPostFromBdCommentatorInfo
  extends Omit<CreateCommentForPostFromServiceProps, "content" | 'postId'> {}

export interface CommentForPostFromBd {
  content: string;
  commentatorInfo: CommentForPostFromBdCommentatorInfo;
  createdAt: string;
  id: string;
}
