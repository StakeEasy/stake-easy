import { MongoClient } from "mongodb";

if (!process.env.MONGO_URL) {
  throw new Error("Please define the MONGO_URL environment variable in .env.local");
}

const uri: string = process.env.MONGO_URL;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // For global declaration in TypeScript
  var _mongoClientPromise: Promise<MongoClient>;
}

// Check if we are running in development mode
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the MongoClient is not constantly recreated.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new MongoClient instance
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function dbConnect() {
  try {
    const client = await clientPromise;
    const db = client.db();
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error("MongoDB connection failed");
  }
}

export async function disconnect() {
  try {
    if (client) {
      await client.close();
      console.log("Disconnected from MongoDB");
    }
  } catch (error) {
    console.error("MongoDB disconnection failed:", error);
  }
}