import { postRepository } from "../repositories/post-repository";
import { CreatePostRequest } from "../routers/types";
import { PostType } from "../db/types";
import { UpdatePostRepository } from "../repositories/types";

export const postService = {
  getAllPosts: async () => await postRepository.getAllPosts(),

  foundCurrentBlogForPost: async (blogId: string) => {
    const currentBlog = await postRepository.foundCurrentBlogForPost(blogId);

    if (!currentBlog) {
      return null;
    } else {
      return currentBlog;
    }
  },

  createNewPost: async ({
    content,
    shortDescription,
    title,
    blogId,
  }: CreatePostRequest) => {
    const currentBlog = await postService.foundCurrentBlogForPost(blogId);

    if (!currentBlog) {
      return null;
    }

    const newPost: PostType = {
      content,
      shortDescription,
      title,
      blogId,
      id: new Date().toISOString(),
      blogName: currentBlog.name,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await postRepository.createNewPost(newPost);

    const { _id, ...postWithoutMongoId } = createdPost as any;

    return postWithoutMongoId;
  },

  getPostById: async (postId: string) => {
    return await postRepository.getPostById(postId);
  },

  updatedPost: async ({
    content,
    shortDescription,
    title,
    postId,
  }: UpdatePostRepository) => {
    return await postRepository.updatedPost({
      postId,
      content,
      shortDescription,
      title,
    });
  },

  deletePost: async (postId: string) => {
    return await postRepository.deletePost(postId);
  },
};
