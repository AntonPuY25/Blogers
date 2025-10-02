import { blogsRepository } from "../repositories/blogs-repository";
import { BlogType } from "../../core/types/db-types";
import {
  DeleteCurrentBlogType,
  UpdateBlogType,
} from "../../core/types/repositories-types";
import { CreateBlogTypeForService } from "./types";

export const blogsService = {
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
      console.warn(error);
    }
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
