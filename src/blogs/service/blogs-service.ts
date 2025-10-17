import { blogsRepository } from "../repositories/blogs-repository";
import { BlogType } from "../../core/types/db-types";
import {
  DeleteCurrentBlogType,
  UpdateBlogType,
} from "../../core/types/repositories-types";
import { CreateBlogTypeForService } from "./types";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";
import { getCreatedBlogWithoutObjectId } from "./blogMappers";
import { blogsQueryRepository } from "../repositories/blog-query-repository";

export const blogsService = {
  createBlog: async ({
    name,
    websiteUrl,
    description,
  }: CreateBlogTypeForService) => {
    const newBlog = {
      id: new Date().toISOString(),
      name,
      description,
      websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const createdBlogId = await blogsRepository.createBlog(newBlog);

    if (!createdBlogId) {
      return {
        errorMessage: ERRORS_MESSAGES.createdBlogErrorFormMongo,
        status: STATUSES_CODE.BadRequest,
        data: null,
      } as ResultObject;
    }

    const { data } = await blogsQueryRepository.getCurrentBlog({
      blogId: newBlog.id,
    });

    if (!data) {
      return {
        errorMessage: ERRORS_MESSAGES.createdBlogErrorFormMongo,
        status: STATUSES_CODE.BadRequest,
        data: null,
      } as ResultObject;
    }

    return {
      status: STATUSES_CODE.Created,
      data: getCreatedBlogWithoutObjectId(data),
    } as ResultObject<BlogType>;
  },

  updateBlog: async ({
    name,
    websiteUrl,
    description,
    blogId,
  }: UpdateBlogType) => {
    const updatedBlogCount = await blogsRepository.updateBlog({
      blogId,
      name,
      description,
      websiteUrl,
    });

    if (!updatedBlogCount) {
      return {
        status: STATUSES_CODE.NotFound,
        data: null,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentBlogById,
      } as ResultObject;
    }

    return {
      status: STATUSES_CODE.NoContent,
      data: null,
      errorMessage: undefined,
    } as ResultObject;
  },

  deleteBlog: async ({ blogId }: DeleteCurrentBlogType) => {
    const deletedBlogId = await blogsRepository.deleteBlog({ blogId });

    if (!deletedBlogId) {
      return {
        status: STATUSES_CODE.NotFound,
        data: null,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentBlogById,
      } as ResultObject;
    }

    return {
      status: STATUSES_CODE.NoContent,
      data: null,
      errorMessage: undefined,
    } as ResultObject;
  },
};
