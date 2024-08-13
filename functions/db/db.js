// import { database } from "firebase-functions/v1/firestore";
import { MongoClient, ServerApiVersion } from "mongodb";
const { MONGODB_URI, MONGODB_DB } = process.env;

let client;
let db;

async function connectToDatabase() {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      await client.connect();
      db = client.db(MONGODB_DB);
    }
    return db;
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
  }
}

export const database = await (async () => await connectToDatabase())();
