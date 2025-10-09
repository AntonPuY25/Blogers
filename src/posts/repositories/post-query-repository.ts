import { blogsCollection, postsCollection } from "../../db/db";
import { GetAllPostsForCurrentBlogProps } from "../service/interfaces";
import { GetAppPostsPaginationWithSortWithSearchQuery } from "../../core/types/pagintaion-types";
import {
  getPagesCount,
  getSkipPagesAndLimit,
} from "../../blogs/repositories/helpers";
import { GetAllCommentsForCurrentPostProps } from "./interface";

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

    if (!currentBlog) {
      return null;
    } else {
      return currentBlog;
    }
  },

  getPostById: async (postId: string) => {
    const currentPost = await postsCollection.findOne(
      { id: postId },
      { projection: { _id: 0 } },
    );

    if (!currentPost) {
      return null;
    }

    return currentPost;
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
      // Получаем комментарии с пагинацией
      postsCollection
        .aggregate([
          { $match: { id: postId } },
          { $unwind: "$comments" },
          { $sort: { "comments.createdAt": sortParams } }, // Сортировка по дате
          { $skip: skip },
          { $limit: limit },
          { $replaceRoot: { newRoot: "$comments" } },
        ])
        .toArray(),

      // Считаем общее количество комментариев
      postsCollection
        .findOne({ id: postId }, { projection: { comments: 1 } })
        .then(post => post?.comments?.length || 0),
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
