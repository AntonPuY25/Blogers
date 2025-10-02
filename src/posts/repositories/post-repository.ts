import { PostType } from "../../core/types/db-types";
import { UpdatePostRepository } from "../../core/types/repositories-types";
import { postsCollection } from "../../db/db";

export const postRepository = {
  createNewPost: async (newPost: PostType) => {
    try {
      await postsCollection.insertOne(newPost);

      return newPost;
    } catch (error) {
      console.error(error);
    }
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
