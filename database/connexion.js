const MongoClient = require("mongodb").MongoClient;
const userConstraints = require('./userConstraints');
const url = "mongodb://localhost:27033";

const dbName = "my_mmo";

const getDb = async () => {
  let db;
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = client.db(dbName);
    await userConstraints(db);
  } catch (error) {
    console.error(error);
  }

  return db;
};


module.exports = getDb;
