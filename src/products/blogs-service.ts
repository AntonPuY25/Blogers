import { blogsRepository } from "../repositories/blogs-repository";
import { CreateBlogTypeForService } from "./types";
import { BlogType } from "../db/types";
import {
  DeleteCurrentBlogType,
  GetCurrentBlogType,
  UpdateBlogType,
} from "../repositories/types";

export const blogsService = {
  getAllBlogs: async () => {
    return await blogsRepository.getAllBlogs();
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
