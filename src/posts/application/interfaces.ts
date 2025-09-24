import { CreatePostRequest } from "../../core/types/routers-types";

export interface GetAllPostsForCurrentBlogProps {
  blogId: string;
}

export interface CreatePostForCurrentBlogProps
  extends Omit<CreatePostRequest, "blogId"> {}
