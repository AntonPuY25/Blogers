import {
  CreateBlogTypeForRepositories,
  DeleteCurrentBlogType,
  GetCurrentBlogType,
  UpdateBlogType,
} from "../../core/types/repositories-types";
import { blogsCollection } from "../../db/db";
import { BlogType } from "../../core/types/db-types";

export const blogsRepository = {
  getAllBlogs: async () => {
    return blogsCollection.find({}).project({ _id: 0 }).toArray();
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
