import {DBBlogs} from "../db/blog-state";
import {CreateBlogType} from "./types";

export const blogsRepository = {
    getAllBlogs:()=> DBBlogs,

    createBlog: ({name,websiteUrl,description}:CreateBlogType)=>{

        const newBlog = {
            id: new Date().getMilliseconds().toString(),
            name,
            description,
            websiteUrl,
        }

        DBBlogs.push(newBlog);

        return newBlog;
    }

}