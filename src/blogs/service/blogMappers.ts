import { GetCreatedBlogWithoutObjectIdProps } from "./types";
import { BlogType } from "../../core/types/db-types";

export const getCreatedBlogWithoutObjectId = ({
  _id,
  ...blog
}: GetCreatedBlogWithoutObjectIdProps): BlogType => {
  return blog
};
