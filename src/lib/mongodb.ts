import { MongoClient, MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const options: MongoClientOptions = {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000,
};
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

/**
 * Returns a connected MongoClient (singleton) instance.
 * Ensures the client is connected and attaches it to Vercel's pool.
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().then((connectedClient) => {
      attachDatabasePool(connectedClient);
      return connectedClient;
    });
  }
  return clientPromise;
}
