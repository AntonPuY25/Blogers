import { CommentForPostForBd } from "./interface";
import { commentsCollection } from "../../db/db";

export const commentsRepository = {
  createCommentForPost: async (comment: CommentForPostForBd) => {
    const createdComments = await commentsCollection.insertOne(comment);

    return createdComments.insertedId;
  },
};
