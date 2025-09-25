import { postRepository } from "../repositories/post-repository";
import { CreatePostRequest } from "../../core/types/routers-types";
import { PostType } from "../../core/types/db-types";
import { UpdatePostRepository } from "../../core/types/repositories-types";
import { GetAllPostsForCurrentBlogProps } from "./interfaces";
import { GetAppPostsPaginationWithSortWithSearchQuery } from "../../core/types/pagintaion-types";
import { getPagesCount } from "../../blogs/repositories/helpers";

export const postService = {
  getAllPosts: async (props: GetAppPostsPaginationWithSortWithSearchQuery) => {
    const { totalCount, items } = await postRepository.getAllPosts(props);

    const pagesCount = getPagesCount({
      totalCount,
      pageSize: props.pageSize || 0,
    });

    return {
      pagesCount,
      page: Number(props?.pageNumber) || 1,
      pageSize: Number(props?.pageSize) || 10,
      totalCount,
      items,
    };
  },

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

  getAllPostsForCurrentBlog: async (props: GetAllPostsForCurrentBlogProps) => {
    const { totalCount, items } =
      await postRepository.getAllPostsForCurrentBlog(props);

    const pagesCount = getPagesCount({
      totalCount,
      pageSize: props.pageSize || 0,
    });

    return {
      pagesCount,
      page: Number(props?.pageNumber) || 1,
      pageSize: Number(props?.pageSize) || 10,
      totalCount,
      items,
    };
  },
};
