import { MongoClient } from "mongodb";
import dotenv from 'dotenv'

dotenv.config()

const mongoUri =  process.env.LOCAL_MONGO_URI_FOR_BLOGS_PROJECT;


if(!mongoUri){
  throw new Error("MongoUri not found.");
}

const mongodbClient = new MongoClient(mongoUri);

const dbBlogs = mongodbClient.db("Bloggers");

export const blogsCollection = dbBlogs.collection("Blogs");
export const postsCollection = dbBlogs.collection("Posts");

export async function runDb() {
  try {
    await mongodbClient.connect();

    await mongodbClient.db('Bloggers').command({ping: 1})

    console.log("Database Connected");
  } catch {
    await mongodbClient.close();

    console.log("Database closed");
  }
}
