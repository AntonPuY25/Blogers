import {PostType} from "./db-types";

export interface CreatePostRequest extends Omit<PostType, 'id' | 'createdAt'> {}

export interface GetCurrentPostId  {
    postId?: string;
}

export interface UpdatePostData {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string"
}