import { blogsCollection, postsCollection, usersCollection } from "../../db/db";

export const testService = {
  clearAll: async () => {
    await blogsCollection.deleteMany({})

    await postsCollection.deleteMany({})

    await usersCollection.deleteMany({})
  }
}