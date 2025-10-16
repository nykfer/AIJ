const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function ensureClientConnected() {
  // Calling connect() multiple times is safe; it will re-use existing pool
  await client.connect();
}

// Function to check connection to the DB cluster
async function checkConnection() {
  await ensureClientConnected();
  await client.db('admin').command({ ping: 1 });
  return true;
}

// Function for getting a DB and creating it if it does not exist
// Note: MongoDB creates a database lazily when a collection is created.
async function getOrCreateDb(dbName) {
  await ensureClientConnected();
  const db = client.db(dbName);
  const collections = await db.listCollections().toArray();
  if (collections.length === 0) {
    // Create and drop a tiny init collection to materialize the DB without leaving artifacts
    const tempCollectionName = '_init';
    await db.createCollection(tempCollectionName);
    await db.collection(tempCollectionName).drop();
  }
  return db;
}

// Function for getting a collection and creating it if it does not exist
async function getOrCreateCollection(dbName, collectionName, options = {}) {
  const db = await getOrCreateDb(dbName);
  const existing = await db.listCollections({ name: collectionName }).toArray();
  if (existing.length === 0) {
    await db.createCollection(collectionName, options);
  }
  return db.collection(collectionName);
}

module.exports = {
  client,
  checkConnection,
  getOrCreateDb,
  getOrCreateCollection,
};
