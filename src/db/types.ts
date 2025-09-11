export interface BlogType {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}

export interface CreateBlogType extends Omit<BlogType, "id"> {}

export interface PostType {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogName: string;
  blogId: string;
}

export interface UpdatePostType extends Omit<PostType, "id" | "blogName"> {}
