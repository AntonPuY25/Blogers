import { postRepository } from "../repositories/post-repository";
import { CreatePostRequest } from "../../core/types/routers-types";
import { PostType } from "../../core/types/db-types";
import { UpdatePostRepository } from "../../core/types/repositories-types";
import { postQueryRepository } from "../repositories/post-query-repository";
import {
  CommentForPostFromBd,
  CreateCommentForPostFromServiceProps,
} from "./interfaces";
import { ObjectId } from "mongodb";

export const postService = {
  createNewPost: async ({
    content,
    shortDescription,
    title,
    blogId,
  }: CreatePostRequest) => {
    const currentBlog =
      await postQueryRepository.foundCurrentBlogForPost(blogId);

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

  createCommentForPost: async ({
    content,
    userId,
    userLogin,
    postId,
  }: CreateCommentForPostFromServiceProps) => {
    const newCreatedCommentForPost: CommentForPostFromBd = {
      id: new ObjectId().toString(),
      content,
      commentatorInfo: {
        userLogin,
        userId,
      },
      createdAt: new Date().toISOString(),
    };

    const isCreatedComment = await postRepository.createCommentForPost({
      ...newCreatedCommentForPost,
      postId,
    });

    return isCreatedComment ? newCreatedCommentForPost : false;
  },
};
