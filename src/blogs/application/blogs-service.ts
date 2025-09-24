import { blogsRepository } from "../repositories/blogs-repository";
import { BlogType } from "../../core/types/db-types";
import {
  DeleteCurrentBlogType,
  GetCurrentBlogType,
  UpdateBlogType,
} from "../../core/types/repositories-types";
import { CreateBlogTypeForService, GetAllBlogsTypeForService } from "./types";
import { getPagesCount } from "../repositories/helpers";

export const blogsService = {
  getAllBlogs: async ({ ...params }: GetAllBlogsTypeForService) => {
    const { totalCount, items } = await blogsRepository.getAllBlogs(params);

    const pagesCount = getPagesCount({
      totalCount,
      pageSize: params.pageSize || 0,
    });

    return {
      pagesCount,
      page: Number(params?.pageNumber) || 1,
      pageSize: Number(params?.pageSize) || 10,
      totalCount,
      items,
    };
  },

  createBlog: async ({
    name,
    websiteUrl,
    description,
  }: CreateBlogTypeForService) => {
    const newBlog: BlogType = {
      id: new Date().toISOString(),
      name,
      description,
      websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    try {
      const createdBlog = await blogsRepository.createBlog(newBlog);

      const { _id, ...blogWithoutMongoId } = createdBlog as any;

      return blogWithoutMongoId;
    } catch (error) {
      console.error(error);
    }
  },

  getCurrentBlog: async ({ blogId }: GetCurrentBlogType) => {
    const blog = await blogsRepository.getCurrentBlog({ blogId });

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
    return await blogsRepository.updateBlog({
      blogId,
      name,
      description,
      websiteUrl,
    });
  },

  deleteBlog: async ({ blogId }: DeleteCurrentBlogType) => {
    return await blogsRepository.deleteBlog({ blogId });
  },
};
