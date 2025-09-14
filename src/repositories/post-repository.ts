import { CreatePostRequest } from "../routers/types";
import { PostType } from "../db/types";
import { UpdatePostRepository } from "./types";
import { blogsCollection, postsCollection } from "../db/db";

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

  createNewPost: async ({
    content,
    shortDescription,
    title,
    blogId,
  }: CreatePostRequest) => {
    const currentBlog = await postRepository.foundCurrentBlogForPost(blogId);

    if (!currentBlog) {
      return null;
    }

    const newPost: PostType = {
      content,
      shortDescription,
      title,
      blogId,
      id: new Date().toISOString(),
      blogName: currentBlog.name,
    };

    await postsCollection.insertOne(newPost);

    const { _id, ...postWithoutMongoId } = newPost as any;

    return postWithoutMongoId;
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
