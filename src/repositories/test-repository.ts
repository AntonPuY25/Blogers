import { blogsCollection, postsCollection } from "../db/db";

export const testRepository = {
    clearAll: async () => {
      await blogsCollection.deleteMany({})

      await postsCollection.deleteMany({})
    }
}