const { Db,ObjectID } = require("mongodb");

module.exports = (app, db) => {
  if (!(db instanceof Db)) {
    throw new Error("Invalid Database");
  }
  const classeCollection = db.collection("classe");

  const addClasse = async(req, res)  => {
    const data = req.body;
    
    data.nom 
    console.log(data);

    const response = await classeCollection.insertOne(data);
    

    if(response.result.n !== 1 || response.result.ok !== 1) {
      res.status(400).json({error: 'Impossible to save this classe ! '});
    }

    res.json(response.ops[0]);
  };

  app.post("/api/classe/:classeId/competences", async (req, res) => {
    const { classeId } = req.params;
    const { nom,obtention,element,effet } = req.body;
    const _id = new ObjectID(classeId);

    const { value } = await classeCollection.findOneAndUpdate(
      {
        _id,
      },
      {
        $push: {
          competences: {
            nom,
            obtention : parseInt(obtention),
            element,
            effet,
            _id: new ObjectID(),
          },
        },
      },
      {
        returnOriginal: false,
      }
    );
    res.json(value);
  });

  app.get("/api/classe/:classeId", async (req, res) => {
    const { classeId } = req.params;

    const classe = await classeCollection.aggregate([
        { $match: {_id: new ObjectID(classeId) }},
        
    ]).toArray();
        
    res.json(classe);
  });

  app.post('/api/classe', addClasse);
    
};