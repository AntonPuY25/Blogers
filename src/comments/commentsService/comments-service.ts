
import { commentsRepository } from "../commentsRepository/comments-repository";
import { CreateCommentForPostFromServiceProps } from "./interface";
import { CommentForPostForBd } from "../commentsRepository/interface";

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

    return await commentsRepository.createCommentForPost({
      ...newCreatedCommentForPost,
      postId,
    });
  },
};
