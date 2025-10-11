import { postRepository } from "../repositories/post-repository";
import { CreatePostRequest } from "../../core/types/routers-types";
import { PostType } from "../../core/types/db-types";
import { UpdatePostRepository } from "../../core/types/repositories-types";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";

export const postService = {
  createNewPost: async ({
    content,
    shortDescription,
    title,
    blogId,
    blogName,
  }: CreatePostRequest) => {
    const newPost: PostType = {
      content,
      shortDescription,
      title,
      blogId,
      id: new Date().toISOString(),
      blogName,
      createdAt: new Date().toISOString(),
    };

    const createdPostObjectId = await postRepository.createNewPost(newPost);

    if (!createdPostObjectId) {
      return {
        data: null,
        errorMessage: ERRORS_MESSAGES.createdPostErrorFormMongo,
        status: STATUSES_CODE.BadRequest,
      } as ResultObject;
    }

    return {
      data: newPost,
      status: STATUSES_CODE.Created,
      errorMessage: undefined,
    } as ResultObject<PostType>;
  },

  updatedPost: async ({
    content,
    shortDescription,
    title,
    postId,
  }: UpdatePostRepository) => {
    const updatedPostsCount = await postRepository.updatedPost({
      postId,
      content,
      shortDescription,
      title,
    });

    if (!updatedPostsCount) {
      return {
        data: null,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentPostById,
        status: STATUSES_CODE.NotFound,
      } as ResultObject;
    }

    return {
      data: null,
      status: STATUSES_CODE.NoContent,
    } as ResultObject;
  },

  deletePost: async (postId: string) => {
    const deletedPostCount =  await postRepository.deletePost(postId);

    if (!deletedPostCount) {
      return {
        data: null,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentPostById,
        status: STATUSES_CODE.NotFound,
      } as ResultObject;
    }

    return {
      data: null,
      status: STATUSES_CODE.NoContent,
    } as ResultObject;
  },
};
