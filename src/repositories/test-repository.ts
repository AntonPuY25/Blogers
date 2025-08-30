import {DBBlogs} from "../db/blog-state";

export const testRepository = {
    clearAll: () => {
        DBBlogs.length = 0;
    }
}