import {PostState} from "../db/post-state";
import {CreatePostRequest} from "../routers/types";
import {DBBlogs} from "../db/blog-state";
import {PostType} from "../db/types";

export const postRepository = {
    getAllPosts: () => PostState,

    createNewPost: ({content,shortDescription,title,blogId}:CreatePostRequest) => {

        const currentBlog = DBBlogs.find(({id})=>blogId === id);

        if(!currentBlog){
            return null;
        }

        const newPost: PostType = {
            content,
            shortDescription,
            title,
            blogId,
            id: new Date().toISOString(),
            blogName: currentBlog.name

        }

        PostState.push(newPost);

        return newPost;
    },

    getPostById: (postId: string) => {
        const currentPost = PostState.find(({id})=>id === postId);

        if(!currentPost){
            return null;
        }

        return currentPost;
    }

}