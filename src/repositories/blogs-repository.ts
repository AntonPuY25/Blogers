import {
  CreateBlogType,
  DeleteCurrentBlogType,
  GetCurrentBlogType,
  UpdateBlogType,
} from "./types";
import { blogsCollection } from "../db/db";
import { BlogType } from "../db/types";

export const blogsRepository = {
  getAllBlogs: async () => {
    return blogsCollection.find({}).project({ _id: 0 }).toArray();
  },

  createBlog: async ({ name, websiteUrl, description }: CreateBlogType) => {
    const newBlog:BlogType = {
      id: new Date().toISOString(),
      name,
      description,
      websiteUrl,
      isMembership: false,
      createdAt: new Date().toString(),
    };

    try {
      await blogsCollection.insertOne(newBlog);

      const { _id, ...blogWithoutMongoId } = newBlog as any;

      return blogWithoutMongoId;
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
