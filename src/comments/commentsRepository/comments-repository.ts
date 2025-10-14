import { CommentForPostForBd, UpdatedCommentByIdRepository } from "./interface";
import { commentsCollection } from "../../db/db";
import { ObjectId } from "mongodb";

export const commentsRepository = {
  createCommentForPost: async (comment: CommentForPostForBd) => {
    const createdComments = await commentsCollection.insertOne(comment);

    return createdComments.insertedId;
  },

  updatedCommentById: async ({
    commentId,
    content,
  }: UpdatedCommentByIdRepository) => {
    const { modifiedCount } = await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content,
        },
      },
    );

    return modifiedCount;
  },
};
