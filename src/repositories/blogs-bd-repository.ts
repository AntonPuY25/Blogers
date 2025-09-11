import { DBBlogs } from "../db/blog-state";
import {
  CreateBlogType,
  DeleteCurrentBlogType,
  GetCurrentBlogType,
  UpdateBlogType,
} from "./types";
import { mongodbClient } from "../db/db";

export const blogsBdRepository = {
  getAllBlogs: async () => {
    return  mongodbClient.db("blogs").collection("blogs").find({}).toArray();
  },
  createBlog: async ({ name, websiteUrl, description }: CreateBlogType) => {
    const newBlog = {
      id: new Date().toISOString(),
      name,
      description,
      websiteUrl,
    };

    DBBlogs.push(newBlog);

    return newBlog;
  },

  getCurrentBlog: async ({ blogId }: GetCurrentBlogType) => {
    const currentBlog = DBBlogs.find(({ id }) => id === blogId);

    if (!currentBlog) {
      return null;
    }

    return currentBlog;
  },

  updateBlog: async ({
    name,
    websiteUrl,
    description,
    blogId,
  }: UpdateBlogType) => {
    const currentBlogIndex = DBBlogs.findIndex(({ id }) => id === blogId);

    if (currentBlogIndex === -1) {
      return null;
    }

    const currentBlog = DBBlogs[currentBlogIndex];

    const newBlog = {
      name,
      description,
      websiteUrl,
    };

    DBBlogs.splice(currentBlogIndex, 1, {
      ...currentBlog,
      name,
      description,
      websiteUrl,
    });

    return newBlog;
  },

  deleteBlog: async ({ blogId }: DeleteCurrentBlogType) => {
    const currentBlogIndex = DBBlogs.findIndex(({ id }) => id === blogId);

    if (currentBlogIndex === -1) {
      return null;
    }

    DBBlogs.splice(currentBlogIndex, 1);

    return true;
  },
};
