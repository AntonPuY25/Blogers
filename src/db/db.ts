import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { SETTINGS } from "../core/settings/settings";

dotenv.config();

const mongoUri = SETTINGS.MONGO_URL;

if (!mongoUri) {
  throw new Error("MongoUri not found.");
}

const mongodbClient = new MongoClient(mongoUri);

const dbBlogs = mongodbClient.db("Bloggers");

export const blogsCollection = dbBlogs.collection("Blogs");
export const postsCollection = dbBlogs.collection("Posts");

export async function runDb() {
  try {
    await mongodbClient.connect();

    await mongodbClient.db("Bloggers").command({ ping: 1 });

    console.log("Database Connected");
  } catch {
    await mongodbClient.close();

    console.log("Database closed");
  }
}
