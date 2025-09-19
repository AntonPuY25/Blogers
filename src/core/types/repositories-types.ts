import {UpdatePostData} from "../../routers/types";

export interface CreateBlogTypeForRepositories {
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

export interface UpdatedBlogDataType extends Omit<CreateBlogTypeForRepositories, 'id'> {};

export interface UpdateBlogType  extends UpdatedBlogDataType, GetCurrentBlogType {}

export interface UpdatePostRepository extends Omit<UpdatePostData, "blogId"> {
    postId: string;
}