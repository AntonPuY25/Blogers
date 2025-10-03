import { CreatedUserDataForBD } from "./interface";
import { usersCollection } from "../../db/db";
import { InsertOneResult } from "mongodb";

export const userRepository = {
  createUser: async (newUser: CreatedUserDataForBD) => {
    try {
      const createdUserResult: InsertOneResult<CreatedUserDataForBD> =
        await usersCollection.insertOne(newUser);

      return createdUserResult.insertedId;

    } catch (error) {
      console.error(error);
    }
  },
};
