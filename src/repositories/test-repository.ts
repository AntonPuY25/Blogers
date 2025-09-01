import {DBBlogs} from "../db/blog-state";
import {PostState} from "../db/post-state";

export const testRepository = {
    clearAll: () => {
        DBBlogs.length = 0;
        PostState.length = 0;
    }
}