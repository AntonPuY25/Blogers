import { GetCurrentBlogType } from "../../core/types/repositories-types";
import { blogsCollection } from "../../db/db";
import { GetAllBlogsTypeForRepositories } from "./types";
import {
  getPagesCount,
  getSkipPagesAndLimitForBlogAndSortPagination,
} from "./helpers";

export const blogsQueryRepository = {
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

    const pagesCount = getPagesCount({
      totalCount,
      pageSize: params.pageSize,
    });

    return {
      pagesCount,
      page: Number(params?.pageNumber),
      pageSize: Number(params?.pageSize),
      totalCount,
      items,
    };
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
};
