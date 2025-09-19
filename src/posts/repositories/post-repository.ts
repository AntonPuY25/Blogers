import { CreatePostRequest } from "../../core/types/routers-types";
import { PostType } from "../../core/types/db-types";
import { UpdatePostRepository } from "../../core/types/repositories-types";
import { blogsCollection, postsCollection } from "../../db/db";

export const postRepository = {
  getAllPosts: async () =>
    postsCollection.find({}).project({ _id: 0 }).toArray(),

  foundCurrentBlogForPost: async (blogId: string) => {
    const currentBlog = await blogsCollection.findOne(
      { id: blogId },
      { projection: { _id: 0 } },
    );

    if (!currentBlog) {
      return null;
    } else {
      return currentBlog;
    }
  },

  createNewPost: async (newPost: PostType) => {
    try {
      await postsCollection.insertOne(newPost);

      return newPost;
    } catch (error) {
      console.error(error);
    }
  },

  getPostById: async (postId: string) => {
    const currentPost = await postsCollection.findOne(
      { id: postId },
      { projection: { _id: 0 } },
    );

    if (!currentPost) {
      return null;
    }

    return currentPost;
  },

  updatedPost: async ({
    content,
    shortDescription,
    title,
    postId,
  }: UpdatePostRepository) => {
    const updatedPost = await postsCollection.updateOne(
      { id: postId }, // Фильтр - по какому документу искать
      {
        $set: {
          title,
          shortDescription,
          content,
        },
      },
    );

    return updatedPost.modifiedCount;
  },

  deletePost: async (postId: string) => {
    const deletedPost = await postsCollection.deleteOne({ id: postId });

    return deletedPost.deletedCount;
  },
};
