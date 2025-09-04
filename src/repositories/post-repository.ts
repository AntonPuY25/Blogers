import { PostState } from "../db/post-state";
import { CreatePostRequest } from "../routers/types";
import { DBBlogs } from "../db/blog-state";
import { PostType } from "../db/types";
import { UpdatePostRepository } from "./types";

export const postRepository = {
  getAllPosts: () => PostState,

  foundCurrentBlogForPost: (blogId: string) => {
    const currentBlog = DBBlogs.find(({ id }) => blogId === id);

    if (!currentBlog) {
      return null;
    } else {
      return currentBlog;
    }
  },

  createNewPost: ({
    content,
    shortDescription,
    title,
    blogId,
  }: CreatePostRequest) => {
    const currentBlog = postRepository.foundCurrentBlogForPost(blogId);

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

    PostState.push(newPost);

    return newPost;
  },

  getPostById: (postId: string) => {
    const currentPost = PostState.find(({ id }) => id === postId);

    if (!currentPost) {
      return null;
    }

    return currentPost;
  },

  updatedPost: ({
    content,
    shortDescription,
    title,
    postId,
  }: UpdatePostRepository) => {
    const currentPostIndex = PostState.findIndex(({ id }) => id === postId);

    const currentPost = PostState[currentPostIndex];

    if (!currentPost) {
      return null;
    }

    const updatedPost = { ...currentPost, title, content, shortDescription };

    PostState.splice(currentPostIndex, 1, updatedPost);

    return updatedPost;
  },

  deletePost: (postId: string) => {
    const currentPostIndex = PostState.findIndex(({ id }) => id === postId);

    if (currentPostIndex !== -1) {
      PostState.splice(currentPostIndex, 1);

      return true;
    }

    return false;
  },
};
