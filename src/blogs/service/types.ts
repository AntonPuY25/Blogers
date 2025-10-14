import { CreateBlogTypeForRepositories } from "../../core/types/repositories-types";
import { BlogType } from "../../core/types/db-types";
import { ObjectId } from "mongodb";

export interface CreateBlogTypeForService
  extends CreateBlogTypeForRepositories {}

export interface GetCreatedBlogWithoutObjectIdProps extends BlogType {
  _id: ObjectId;
}
