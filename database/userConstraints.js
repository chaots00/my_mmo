module.exports = async (db) => {
  const collectionName = "users";
  const existingCollections = await db.listCollections().toArray();
  if (existingCollections.some((c) => c.name === collectionName)) {
    return;
  }
  

  await db.createCollection(collectionName, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["mail","password","pseudo", "classe",],
        properties: {
          mail: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          password: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          pseudo: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          classe: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          sac: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["item",],
              properties: {
                item: {
                  bsonType: "string",
                  description: "must be a string and is required",
                },
              },
            },
          },
        },
      },
    },
  });
};


