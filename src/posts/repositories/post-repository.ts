import { PostType } from "../../core/types/db-types";
import { UpdatePostRepository } from "../../core/types/repositories-types";
import { blogsCollection, postsCollection } from "../../db/db";
import { GetAllPostsForCurrentBlogProps } from "../application/interfaces";
import { GetAppPostsPaginationWithSortWithSearchQuery } from "../../core/types/pagintaion-types";
import { getSkipPagesAndLimitForBlogAndSortPagination } from "../../blogs/repositories/helpers";
import { SortDirection } from "mongodb";

export const postRepository = {
  getAllPosts: async (props: GetAppPostsPaginationWithSortWithSearchQuery) => {
    const { skip, limit } = getSkipPagesAndLimitForBlogAndSortPagination({
      pageNumber: props.pageNumber,
      pageSize: props.pageSize,
    });

    const sortParams =
      props?.sortBy && props?.sortDirection
        ? { [props.sortBy]: props.sortDirection }
        : { createdAt: -1 as SortDirection };

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find({})
        .skip(skip)
        .limit(limit)
        .sort(sortParams)
        .project({ _id: 0 })
        .toArray(),

      postsCollection.countDocuments(),
    ]);

    return { items, totalCount };
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

  createNewPost: async (newPost: PostType) => {
    try {
      await postsCollection.insertOne(newPost);

      return newPost;
    } catch (error) {
      console.error(error);
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

  updatedPost: async ({
    content,
    shortDescription,
    title,
    postId,
  }: UpdatePostRepository) => {
    const updatedPost = await postsCollection.updateOne(
      { id: postId }, // Фильтр - по какому документу искать
      {
        $set: {
          title,
          shortDescription,
          content,
        },
      },
    );

    return updatedPost.modifiedCount;
  },

  deletePost: async (postId: string) => {
    const deletedPost = await postsCollection.deleteOne({ id: postId });

    return deletedPost.deletedCount;
  },

  getAllPostsForCurrentBlog: async ({
    blogId,
    pageSize,
    pageNumber,
    sortBy,
    sortDirection,
  }: GetAllPostsForCurrentBlogProps) => {
    const { skip, limit } = getSkipPagesAndLimitForBlogAndSortPagination({
      pageNumber,
      pageSize,
    });

    const sortParams =
      sortBy && sortDirection
        ? {
            [sortBy]: sortDirection,
          }
        : { createdAt: -1 as SortDirection };

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find({ blogId })
        .skip(skip)
        .limit(limit)
        .sort(sortParams)
        .project({ _id: 0 })
        .toArray(),

      postsCollection.countDocuments(),
    ]);

    return { items, totalCount };
  },
};
