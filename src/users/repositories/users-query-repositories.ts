import {
  CreatedUserDataForBD,
  GetCurrentUserByObjectIdProps,
} from "./interface";
import { usersCollection } from "../../db/db";
import { WithId } from "mongodb";
import { getUserMappedDataForCreate } from "./users-mappers";
import { GetUsersPaginationWithSortWithSearchQuery } from "../../core/types/pagintaion-types";
import {
  getPagesCount,
  getSkipPagesAndLimit,
} from "../../blogs/repositories/helpers";

export const usersQueryRepositories = {
  getCurrentUserByObjectId: async ({ _id }: GetCurrentUserByObjectIdProps) => {
    try {
      const currentUser: WithId<CreatedUserDataForBD> | null =
        await usersCollection.findOne({
          _id,
        });

      if (!currentUser) {
        return null;
      }

      return getUserMappedDataForCreate(currentUser);
    } catch (e) {
      console.log(e);
    }
  },

  getAllUsers: async ({
    pageNumber,
    pageSize,
    sortDirection,
    sortBy,
    searchLoginTerm,
    searchEmailTerm,
  }: GetUsersPaginationWithSortWithSearchQuery) => {
    const { skip, limit } = getSkipPagesAndLimit({
      pageNumber,
      pageSize,
    });

    const searchQuery =
      searchLoginTerm || searchEmailTerm
        ? {
            $or: [
              ...(searchLoginTerm
                ? [{ login: { $regex: searchLoginTerm, $options: "i" } }]
                : []),
              ...(searchEmailTerm
                ? [{ email: { $regex: searchEmailTerm, $options: "i" } }]
                : []),
            ],
          }
        : {};

    const sortParams = { [sortBy]: sortDirection };

    const [items, totalCount] = await Promise.all([
      usersCollection
        .find(searchQuery)
        .sort(sortParams)
        .skip(skip)
        .limit(limit)
        .toArray(),

      usersCollection.countDocuments(searchQuery), // Подсчет общего количества
    ]);

    const pagesCount = getPagesCount({
      totalCount,
      pageSize: pageSize,
    });

    return {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items,
    };
  },
};
