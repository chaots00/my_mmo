const { Db, ObjectID } = require("mongodb");

module.exports = (app, db) => {
  if (!(db instanceof Db)) {
    throw new Error("Invalid Database");
  }
  const itemCollection = db.collection("item");

  const addItem = async(req, res)  => {
    const data = req.body;
    
    
    
    data.prix_vente  = parseInt(data.prix_vente);
    data.prix_achat  = parseInt(data.prix_achat);

    const response = await itemCollection.insertOne(data);

    if(response.result.n !== 1 || response.result.ok !== 1) {
      res.status(400).json({error: 'Impossible to save this classe ! '});
    }

    res.json(response.ops[0]);
  };



  app.get("/item/:itemId", async (req, res) => {
    const { itemId } = req.params;

    const _id = new ObjectID(itemId);
    const item = await itemCollection.findOne({ _id });
    if (item == null) {
      return res.status(404).send({ error: "Impossible to find this item" });
    }

    res.json(item);
  });

  app.post('/api/item', addItem);

};