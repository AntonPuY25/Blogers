import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { SETTINGS } from "../core/settings/settings";
import { BLOGS_COLLECTION_NAME } from "./constants";
import { CreatedUserDataForBD } from "../users/repositories/interface";

dotenv.config();

const mongoUri = SETTINGS.MONGO_URL;

if (!mongoUri) {
  throw new Error("MongoUri not found.");
}

const mongodbClient = new MongoClient(mongoUri);

const dbBlogs = mongodbClient.db("Bloggers");

export const blogsCollection = dbBlogs.collection(BLOGS_COLLECTION_NAME.BLOGS);
export const postsCollection = dbBlogs.collection(BLOGS_COLLECTION_NAME.POSTS);
export const usersCollection = dbBlogs.collection<CreatedUserDataForBD>(BLOGS_COLLECTION_NAME.USERS);

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
