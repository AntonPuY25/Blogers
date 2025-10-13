import { commentsCollection } from "../../db/db";
import { ObjectId, WithId } from "mongodb";
import { CommentForPostForBd, MappedCommentForPostForBd } from "./interface";
import {
  getCurrentCommentsForPostWithoutObjectIdAndPostId,
  getCurrentCommentWithoutObjectIdAndPostId,
} from "./comments-mappers";
import { GetAllCommentsForCurrentPostProps } from "../../posts/repositories/interface";
import {
  getPagesCount,
  getSkipPagesAndLimit,
} from "../../blogs/repositories/helpers";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";

export const commentsQueryRepositories = {
  getCurrentCommentById: async (_id: ObjectId) => {
    const currentComment: WithId<CommentForPostForBd> | null =
      await commentsCollection.findOne({ _id });

    if (currentComment) {
      return {
        data: getCurrentCommentWithoutObjectIdAndPostId(currentComment),
        status: STATUSES_CODE.NoContent,
      } as ResultObject<MappedCommentForPostForBd>;
    }

    return {
      status: STATUSES_CODE.NotFound,
      errorMessage: ERRORS_MESSAGES.notFoundCurrentCommentById,
      data: null,
    } as ResultObject;
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
      items: getCurrentCommentsForPostWithoutObjectIdAndPostId(items),
    };
  },
};
