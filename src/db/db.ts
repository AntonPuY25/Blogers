import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";

export const mongodbClient = new MongoClient(mongoUri);

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
