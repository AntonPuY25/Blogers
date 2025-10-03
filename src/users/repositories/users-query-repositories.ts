import {
  CreatedUserDataForBD,
  GetCurrentUserByObjectIdProps,
} from "./interface";
import { usersCollection } from "../../db/db";
import { WithId } from "mongodb";
import { getUserMappedDataForCreate } from "./users-mappers";

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
};
