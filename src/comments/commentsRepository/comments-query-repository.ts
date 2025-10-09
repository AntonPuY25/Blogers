import { commentsCollection } from "../../db/db";
import { ObjectId, WithId } from "mongodb";
import { CommentForPostForBd } from "./interface";
import { getCurrentCommentWithoutObjectIdAndPostId } from "./comments-mappers";

export const commentsQueryRepositories = {
  getCurrentCommentById: async (_id: ObjectId) => {
    const currentComment: WithId<CommentForPostForBd> | null =
      await commentsCollection.findOne({ _id });

    if(!currentComment){
      return false
    }

    return getCurrentCommentWithoutObjectIdAndPostId(currentComment);
  },
};
