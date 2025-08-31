import {DBBlogs} from "../db/blog-state";
import {CreateBlogType, GetCurrentBlogType} from "./types";

export const blogsRepository = {
    getAllBlogs:()=> DBBlogs,

    createBlog: ({name,websiteUrl,description,id}:CreateBlogType)=>{

        const newBlog = {
            id,
            name,
            description,
            websiteUrl,
        }

        DBBlogs.push(newBlog);

        return newBlog;
    },

    getCurrentBlog: ({blogId}:GetCurrentBlogType)=>{
        const currentBlog = DBBlogs.find(({id})=>id === blogId);

        if(!currentBlog){
            return null;
        }

        return currentBlog;
    }

}