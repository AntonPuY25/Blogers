import { blogsCollection, postsCollection } from "../../db/db";
import { GetAllPostsForCurrentBlogProps } from "../service/interfaces";
import { GetAppPostsPaginationWithSortWithSearchQuery } from "../../core/types/pagintaion-types";
import {
  getPagesCount,
  getSkipPagesAndLimit,
} from "../../blogs/repositories/helpers";
import { ResultObject } from "../../core/types/result-object";
import { BlogType, PostType } from "../../core/types/db-types";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";
import { WithId } from "mongodb";

export const postQueryRepository = {
  getAllPosts: async (props: GetAppPostsPaginationWithSortWithSearchQuery) => {
    const { skip, limit } = getSkipPagesAndLimit({
      pageNumber: props.pageNumber,
      pageSize: props.pageSize,
    });

    const sortParams = { [props.sortBy]: props.sortDirection };

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find({})
        .sort(sortParams)
        .skip(skip)
        .limit(limit)
        .project({ _id: 0 })
        .toArray(),

      postsCollection.countDocuments(),
    ]);

    const pagesCount = getPagesCount({
      totalCount,
      pageSize: props.pageSize,
    });

    return {
      pagesCount,
      page: Number(props?.pageNumber),
      pageSize: Number(props?.pageSize),
      totalCount,
      items,
    };
  },

  foundCurrentBlogForPost: async (blogId: string) => {
    const currentBlog = await blogsCollection.findOne(
      { id: blogId },
      { projection: { _id: 0 } },
    );

    if (currentBlog) {
      return {
        status: STATUSES_CODE.Success,
        data: currentBlog,
        errorMessage: undefined,
      } as ResultObject<WithId<BlogType>>;
    }

    return {
      status: STATUSES_CODE.NotFound,
      data: null,
      errorMessage: ERRORS_MESSAGES.notFoundCurrentBlogById,
    } as ResultObject;
  },

  getPostById: async (postId: string) => {
    const currentPost = await postsCollection.findOne(
      { id: postId },
      { projection: { _id: 0 } },
    );

    if (currentPost) {
      return {
        status: STATUSES_CODE.Success,
        data: currentPost,
        errorMessage: undefined,
      } as ResultObject<WithId<PostType>>;
    }

    return {
      status: STATUSES_CODE.NotFound,
      data: null,
      errorMessage: ERRORS_MESSAGES.notFoundCurrentPostById,
    } as ResultObject;
  },

  getAllPostsForCurrentBlog: async ({
    blogId,
    pageSize,
    pageNumber,
    sortBy,
    sortDirection,
  }: GetAllPostsForCurrentBlogProps) => {
    const { skip, limit } = getSkipPagesAndLimit({
      pageNumber,
      pageSize,
    });

    const sortParams = { [sortBy]: sortDirection };

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find({ blogId })
        .sort(sortParams)
        .skip(skip)
        .limit(limit)
        .project({ _id: 0 })
        .toArray(),

      postsCollection.countDocuments({ blogId }),
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
