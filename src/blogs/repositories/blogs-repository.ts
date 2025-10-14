import {
  DeleteCurrentBlogType,
  UpdateBlogType,
} from "../../core/types/repositories-types";
import { blogsCollection } from "../../db/db";
import { BlogType } from "../../core/types/db-types";

export const blogsRepository = {
  createBlog: async (newBlog: BlogType) => {
    try {
      const createdBlog=  await blogsCollection.insertOne(newBlog);

      return createdBlog.insertedId;
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
