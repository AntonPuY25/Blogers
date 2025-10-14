import { postRepository } from "../repositories/post-repository";
import { CreatePostRequest } from "../../core/types/routers-types";
import { PostType } from "../../core/types/db-types";
import { UpdatePostRepository } from "../../core/types/repositories-types";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";
import { createPostMapper } from "./postMappers";
import { postQueryRepository } from "../repositories/post-query-repository";
import { blogsQueryRepository } from "../../blogs/repositories/blog-query-repository";

export const postService = {
  createNewPost: async ({
    content,
    shortDescription,
    title,
    blogId,
  }: CreatePostRequest) => {
    const {
      data: currentBlogData,
      errorMessage: currentBlogErrorMessage,
      status: currentBlogStatus,
    } = await blogsQueryRepository.getCurrentBlog({ blogId });

    if (!currentBlogData?.id) {
      return {
        errorMessage: currentBlogErrorMessage,
        status: currentBlogStatus,
      } as ResultObject;
    }

    const newPost: PostType = {
      content,
      shortDescription,
      title,
      blogId: currentBlogData.id,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      blogName: currentBlogData.name,
    };

    const createdPostObjectId = await postRepository.createNewPost(newPost);

    if (!createdPostObjectId) {
      return {
        data: null,
        errorMessage: ERRORS_MESSAGES.createdPostErrorFormMongo,
        status: STATUSES_CODE.BadRequest,
      } as ResultObject;
    }

    const { data, errorMessage, status } =
      await postQueryRepository.getPostById(newPost.id);

    if (!data) {
      return {
        data: null,
        errorMessage,
        status,
      } as ResultObject;
    }

    return {
      data: createPostMapper(data),
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
    const deletedPostCount = await postRepository.deletePost(postId);

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
