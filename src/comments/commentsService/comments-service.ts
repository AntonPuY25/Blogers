import { commentsRepository } from "../commentsRepository/comments-repository";
import {
  CreateCommentForPostFromServiceProps, DeleteCommentServiceProps,
  UpdatedCommentServiceProps,
} from "./interface";
import { CommentForPostForBd } from "../commentsRepository/interface";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";
import { ObjectId, WithId } from "mongodb";
import { commentsQueryRepositories } from "../commentsRepository/comments-query-repository";

export const commentsService = {
  createCommentForPost: async ({
    content,
    userId,
    userLogin,
    postId,
  }: CreateCommentForPostFromServiceProps) => {
    const newCreatedCommentForPost: CommentForPostForBd = {
      content,
      commentatorInfo: {
        userLogin,
        userId,
      },
      createdAt: new Date().toISOString(),
      postId,
    };

    const createdCommentId = await commentsRepository.createCommentForPost(
      newCreatedCommentForPost,
    );

    if (!createdCommentId) {
      return {
        data: null,
        status: STATUSES_CODE.NotFound,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentCommentById,
      } as ResultObject;
    }

    return {
      data: { ...newCreatedCommentForPost, ...createdCommentId },
      status: STATUSES_CODE.Success,
    } as ResultObject<WithId<CommentForPostForBd>>;
  },

  updateCommentForPost: async (
    commentUpdateData: UpdatedCommentServiceProps,
  ) => {
    const { data } = await commentsQueryRepositories.getCurrentCommentById(
      new ObjectId(commentUpdateData.commentId),
    );

    if (!data) {
      return {
        status: STATUSES_CODE.NotFound,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentCommentById,
      } as ResultObject;
    }

    if (data.commentatorInfo.userId !== commentUpdateData.userId) {
      return {
        status: STATUSES_CODE.Forbidden,
        errorMessage: ERRORS_MESSAGES.userTryUpdateWrongComment,
      } as ResultObject;
    }

    await commentsRepository.updatedCommentById(commentUpdateData);

    return {
      data: null,
      status: STATUSES_CODE.NoContent,
    } as ResultObject;
  },

  deleteCommentById: async (
      commentDeleteData: DeleteCommentServiceProps,
  ) => {
    const { data } = await commentsQueryRepositories.getCurrentCommentById(
        new ObjectId(commentDeleteData.commentId),
    );

    if (!data) {
      return {
        status: STATUSES_CODE.NotFound,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentCommentById,
      } as ResultObject;
    }

    if (data.commentatorInfo.userId !== commentDeleteData.userId) {
      return {
        status: STATUSES_CODE.Forbidden,
        errorMessage: ERRORS_MESSAGES.userTryUpdateWrongComment,
      } as ResultObject;
    }

    await commentsRepository.deleteComment(commentDeleteData.commentId);

    return {
      data: null,
      status: STATUSES_CODE.NoContent,
    } as ResultObject;
  },
};
