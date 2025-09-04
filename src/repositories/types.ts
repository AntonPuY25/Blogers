import {UpdatePostData} from "../routers/types";

export interface CreateBlogType {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
}

export interface GetCurrentBlogType {
    blogId?: string;
}

export interface DeleteCurrentBlogType {
    blogId: string;
}

export interface UpdatedBlogDataType extends Omit<CreateBlogType, 'id'> {};

export interface UpdateBlogType  extends UpdatedBlogDataType, GetCurrentBlogType {}

export interface UpdatePostRepository extends Omit<UpdatePostData, "blogId"> {
    postId: string;
}