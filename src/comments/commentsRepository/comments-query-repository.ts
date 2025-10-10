import { commentsCollection } from "../../db/db";
import { ObjectId, WithId } from "mongodb";
import { CommentForPostForBd } from "./interface";
import { getCurrentCommentWithoutObjectIdAndPostId } from "./comments-mappers";
import { GetAllCommentsForCurrentPostProps } from "../../posts/repositories/interface";
import {
  getPagesCount,
  getSkipPagesAndLimit,
} from "../../blogs/repositories/helpers";

export const commentsQueryRepositories = {
  getCurrentCommentById: async (_id: ObjectId) => {
    const currentComment: WithId<CommentForPostForBd> | null =
      await commentsCollection.findOne({ _id });

    if (!currentComment) {
      return false;
    }

    return getCurrentCommentWithoutObjectIdAndPostId(currentComment);
  },

  getAllCommentsForCurrentPost: async ({
    postId,
    pageSize,
    pageNumber,
    sortBy,
    sortDirection,
  }: GetAllCommentsForCurrentPostProps) => {
    const { skip, limit } = getSkipPagesAndLimit({
      pageNumber,
      pageSize,
    });

    const sortParams = { [sortBy]: sortDirection };

    const [items, totalCount] = await Promise.all([
      commentsCollection
        .find({ postId })
        .sort(sortParams)
        .skip(skip)
        .limit(limit)
        .toArray(),

      commentsCollection.countDocuments({ postId }),
    ]);

    const pagesCount = getPagesCount({
      totalCount,
      pageSize: pageSize,
    });

    return {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items,
    };
  },
};
