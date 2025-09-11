import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";

const mongodbClient = new MongoClient(mongoUri);

const dbBlogs = mongodbClient.db("blogs");

export const blogsCollection = dbBlogs.collection("blogs");
export const postsCollection = dbBlogs.collection("posts");

export async function runDb() {
  try {
    await mongodbClient.connect();

    await mongodbClient.db('Blogers').command({ping: 1})

    console.log("Database Connected");
  } catch {
    await mongodbClient.close();

    console.log("Database closed");
  }
}
