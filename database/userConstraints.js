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
        required: ["mail","password","pseudo"],
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
            bsonType: "objectId",
            description: "must be a objectId and is required",
          },
          main: {
            bsonType: "objectId",
            description: "must be a objectId and is required",
          },
          niv: {
            bsonType: "int",
            minimum: 0,
            maximum: 100,
            description: 'must be an integer in [ 0, 100 ] and is required',
          }, 
          xp: {
            bsonType: "int",
            minimum: 0,
            maximum: 100000,
            description: 'must be an integer in [ 0, 10000] and is required',
          },
          argent: {
            bsonType: "int",
            minimum: 0,
            maximum: 1000000,
            description: 'must be an integer in [ 0, 1000000 ] and is required',
          },
          sac: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["item",],
              properties: {
                item: {
                  bsonType: "objectId",
                  description: "must be a objectId and is required",
                },
              },
            },
          },
        },
      },
    },
  });
};


