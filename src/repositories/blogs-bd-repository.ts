import { DBBlogs } from "../db/blog-state";
import { ObjectId } from "mongodb";
import {
  CreateBlogType,
  DeleteCurrentBlogType,
  GetCurrentBlogType,
  UpdateBlogType,
} from "./types";
import { blogsCollection } from "../db/db";

export const blogsBdRepository = {
  getAllBlogs: async () => {
    return blogsCollection.find({}).toArray();
  },

  createBlog: async ({ name, websiteUrl, description }: CreateBlogType) => {
    const newBlog = {
      id: new Date().toISOString(),
      name,
      description,
      websiteUrl,
    };

    try {
      await blogsCollection.insertOne(newBlog);

      return newBlog;
    } catch (error) {
      console.error(error);
    }
  },

  getCurrentBlog: async ({ blogId }: GetCurrentBlogType) => {
    const blog = await blogsCollection.findOne({ id: blogId });

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
