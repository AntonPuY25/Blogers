export interface BlogType {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}

export interface PostType {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogName: string;
  blogId: string;
}

export interface UpdatePostType extends Omit<PostType, "id" | "blogName"> {}
