import { CreateBlogTypeForRepositories } from "../../core/types/repositories-types";
import { GetAppBlogsPaginationWithSortWithSearchQuery } from "../../core/types/pagintaion-types";

export interface CreateBlogTypeForService
  extends CreateBlogTypeForRepositories {}

export interface GetAllBlogsTypeForService
  extends GetAppBlogsPaginationWithSortWithSearchQuery {}
