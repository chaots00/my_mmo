const MongoClient = require("mongodb").MongoClient;
const userConstraints = require('./userConstraints');
const classeConstraints = require('./classeConstraints');
const monstreConstraints = require('./monstreConstraints');
const pnjConstraints = require('./pnjConstraints');
const itemConstraints = require('./itemConstraints');
const url = "mongodb://localhost:27033";

const dbName = "my_mmo";

const getDb = async () => {
  let db;
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = client.db(dbName);
    await userConstraints(db),classeConstraints(db),monstreConstraints(db),pnjConstraints(db),itemConstraints(db);
  } catch (error) {
    console.error(error);
  }

  return db;
};


module.exports = getDb;
