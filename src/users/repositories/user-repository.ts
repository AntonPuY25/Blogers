import { CreatedUserDataForBD } from "./interface";
import { usersCollection } from "../../db/db";
import { InsertOneResult, ObjectId } from "mongodb";

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

  deleteUserById: async (_id: ObjectId) => {
    try {
      const createdUserResult = await usersCollection.deleteOne({_id});

      return createdUserResult.deletedCount;

    } catch (error) {
      console.error(error);
    }
  },
};
