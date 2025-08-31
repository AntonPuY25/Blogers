export interface CreateBlogType {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
}

export interface GetCurrentBlogType {
    blogId: string;
}