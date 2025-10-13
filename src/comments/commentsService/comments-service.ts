import { commentsRepository } from "../commentsRepository/comments-repository";
import { CreateCommentForPostFromServiceProps, UpdatedCommentServiceProps } from "./interface";
import { CommentForPostForBd } from "../commentsRepository/interface";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";
import { WithId } from "mongodb";

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

  updateCommentForPost: async ({}:UpdatedCommentServiceProps)=>{

  }
};
