import {
  DeleteCurrentBlogType,
  GetCurrentBlogType,
  UpdateBlogType,
} from "../../core/types/repositories-types";
import { blogsCollection } from "../../db/db";
import { BlogType } from "../../core/types/db-types";
import { GetAllBlogsTypeForRepositories } from "./types";
import { getSkipPagesAndLimitForBlogAndSortPagination } from "./helpers";

export const blogsRepository = {
  getAllBlogs: async ({ ...params }: GetAllBlogsTypeForRepositories) => {
    const { skip, limit } = getSkipPagesAndLimitForBlogAndSortPagination({
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    });

    const searchQuery = params?.searchNameTerm
      ? { name: { $regex: params.searchNameTerm, $options: "i" } }
      : {};

    const sortParams = { [params.sortBy]: params.sortDirection };

    const [items, totalCount] = await Promise.all([
      blogsCollection
        .find(searchQuery)
        .sort(sortParams)
        .skip(skip)
        .limit(limit)
        .project({ _id: 0 })
        .toArray(),

      blogsCollection.countDocuments(searchQuery), // Подсчет общего количества
    ]);

    return { items, totalCount };
  },

  createBlog: async (newBlog: BlogType) => {
    try {
      await blogsCollection.insertOne(newBlog);

      return newBlog;
    } catch (error) {
      console.error(error);
    }
  },

  getCurrentBlog: async ({ blogId }: GetCurrentBlogType) => {
    const blog = await blogsCollection.findOne(
      { id: blogId },
      { projection: { _id: 0 } },
    );

    if (!blog) {
      return null;
    }

    return blog;
  },

  updateBlog: async ({
    name,
    websiteUrl,
    description,
    blogId,
  }: UpdateBlogType) => {
    const blog = await blogsCollection.updateOne(
      { id: blogId }, // Фильтр - по какому документу искать
      {
        $set: {
          name,
          description,
          websiteUrl,
        },
      },
    );

    return blog.modifiedCount;
  },

  deleteBlog: async ({ blogId }: DeleteCurrentBlogType) => {
    const currentBlogIndex = await blogsCollection.deleteOne({ id: blogId });

    return currentBlogIndex.deletedCount;
  },
};
