import { GetCurrentBlogType } from "../../core/types/repositories-types";
import { blogsCollection } from "../../db/db";
import { GetAllBlogsTypeForRepositories } from "./types";
import { getPagesCount, getSkipPagesAndLimit } from "./helpers";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";
import { WithId } from "mongodb";
import { BlogType } from "../../core/types/db-types";

export const blogsQueryRepository = {
  getAllBlogs: async ({ ...params }: GetAllBlogsTypeForRepositories) => {
    const { skip, limit } = getSkipPagesAndLimit({
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
      return {
        data: null,
        status: STATUSES_CODE.NotFound,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentBlogById,
      } as ResultObject;
    }

    return {
      data: blog,
      status: STATUSES_CODE.Success,
    } as ResultObject<WithId<BlogType>>;
  },
};
