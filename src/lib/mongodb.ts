import { MongoClient, MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const options: MongoClientOptions = {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 30000,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000,
};
let client: MongoClient;
try {
  client = new MongoClient(uri, options);
} catch (err) {
  throw new Error(
    `Failed to create MongoDB client: ${err instanceof Error ? err.message : String(err)}`,
  );
}

// Attach the client to ensure proper cleanup on function suspension
// If the client is not properly initialized or if attachDatabasePool fails,
// an error will be thrown and the function will not be attached.
try {
  attachDatabasePool(client);
} catch (err) {
  throw new Error(
    `Failed to attach database pool: ${err instanceof Error ? err.message : String(err)}`,
  );
}

// Export a module-scoped MongoClient to ensure the client can be shared across functions.
export default client;
