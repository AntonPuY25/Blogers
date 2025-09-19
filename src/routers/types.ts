import {PostType} from "../core/types/db-types";

export interface CreatePostRequest extends Omit<PostType, 'id' | 'blogName'> {}

export interface GetCurrentPostId  {
    postId?: string;
}

export interface UpdatePostData {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string"
}