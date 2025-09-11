import {PostState} from "../db/post-state";
import { blogsCollection } from "../db/db";

export const testRepository = {
    clearAll: async () => {
      await blogsCollection.deleteMany({})

        PostState.length = 0;
    }
}