import { CreatePostWithObjectId } from "./interfaces";
import { PostType } from "../../core/types/db-types";

export const createPostMapper = ({_id, ...post}: CreatePostWithObjectId): PostType => {
  return {
    ...post,
  }
}