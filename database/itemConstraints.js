module.exports = async (db) => {
  const collectionName = "item";
  const existingCollections = await db.listCollections().toArray();
  if (existingCollections.some((c) => c.name === collectionName)) {
    return;
  }


  await db.createCollection(collectionName, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["nom", "effet", "type", "prix_vente", "prix_achat"],
        properties: {
          nom: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          effet: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          type: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          prix_vente: {
            bsonType: "int",
            description: "must be a integer and is required",
          },
          prix_achat: {
            bsonType: "int",
            description: "must be a integer and is required",
          },
        },
      },
    },
  });
};


