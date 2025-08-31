import {DBBlogs} from "../db/blog-state";
import {CreateBlogType, DeleteCurrentBlogType, GetCurrentBlogType, UpdateBlogType} from "./types";

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
    },

    updateBlog: ({name,websiteUrl,description,blogId}:UpdateBlogType)=>{

        const currentBlogIndex = DBBlogs.findIndex(({id})=>id === blogId);

        if(currentBlogIndex === -1){
            return null;
        }

        const currentBlog = DBBlogs[currentBlogIndex];

        const newBlog = {
            name,
            description,
            websiteUrl,
        }

        DBBlogs.splice(currentBlogIndex, 1, {...currentBlog, name, description, websiteUrl});

        return newBlog;
    },

    deleteBlog: ({blogId}:DeleteCurrentBlogType)=>{
        const currentBlogIndex = DBBlogs.findIndex(({id})=>id === blogId);

        if(currentBlogIndex === -1){
            return null;
        }

        DBBlogs.splice(currentBlogIndex, 1);

        return true;
    },


}