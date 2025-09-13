import { MongoClient } from "mongodb";

const mongoUri = "mongodb+srv://Admin:Admin@bloggers.qkgu6ey.mongodb.net/?retryWrites=true&w=majority&appName=Bloggers";

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
