module.exports = async (db) => {
  const collectionName = "pnj";
  const existingCollections = await db.listCollections().toArray();
  if (existingCollections.some((c) => c.name === collectionName)) {
    return;
  }


  await db.createCollection(collectionName, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["nom", "item"],
        properties: {
          nom: {
            bsonType: "string",
            description: "must be a string and is required",
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


