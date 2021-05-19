module.exports = async (db) => {
  const collectionName = "monstre";
  const existingCollections = await db.listCollections().toArray();
  if (existingCollections.some((c) => c.name === collectionName)) {
    return;
  }


  await db.createCollection(collectionName, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["nom", "pv", "type", "exp", "dega", "item"],
        properties: {
          nom: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          pv: {
            bsonType: "int",
            description: "must be a integer and is required",
          },
          type: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          exp: {
            bsonType: "int",
            description: "must be a integer and is required",
          },
          dega: {
            bsonType: "int",
            description: "must be a integer and is required",
          },
          item: {
            bsonType: "objectId",
            description: "must be a objectId and is required",

          },
        },

      },
    },
  });
};


