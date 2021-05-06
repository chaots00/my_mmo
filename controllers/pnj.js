const { Db, ObjectID } = require("mongodb");

module.exports = (app, db) => {
    if (!(db instanceof Db)) {
        throw new Error("Invalid Database");
    }
    const pnjCollection = db.collection("pnj");

    const addpnjquette = async (req, res) => {
        const data = req.body;
        data.item = new ObjectID(data.item);
        data.monstre = new ObjectID(data.monstre);


        data.nom


        const response = await pnjCollection.insertOne(data);

        if (response.result.n !== 1 || response.result.ok !== 1) {
            res.status(400).json({ error: 'Impossible to save this classe ! ' });
        }

        res.json(response.ops[0]);
    };

    const addpnjvente = async (req, res) => {
        const data = req.body;
        data.item = new ObjectID(data.item);


        data.nom


        const response = await pnjCollection.insertOne(data);

        if (response.result.n !== 1 || response.result.ok !== 1) {
            res.status(400).json({ error: 'Impossible to save this classe ! ' });
        }

        res.json(response.ops[0]);
    };

    app.get("/pnj/:pnjId", async (req, res) => {
        const { pnjId } = req.params;

        const _id = new ObjectID(pnjId);
        const pnj = await pnjCollection.findOne({ _id });
        if (pnj == null) {
            return res.status(404).send({ error: "Impossible to find this pnj" });
        }

        res.json(pnj);
    });
// recuperé toute les info du vendeur 
app.get("/api/pnj/:pnjId", async (req, res) => {
    const { pnjId } = req.params;
  
    const pnjv = await pnjCollection.aggregate([
        { $match: {_id: new ObjectID(pnjId) }},
        {$lookup: {
          from: 'item',
          localField: 'pnj',
          foreignField: 'pnj',
          as: 'item'
        }},
        { $unwind: '$item' },
        { $project: {nom: 1,item:1, _id: 1}},
    ]).toArray();
  
    res.json(pnjv);
  });
  //recupere toute les info du pnj quete 
  app.get("/api/pnj/:pnjId", async (req, res) => {
    const { pnjId } = req.params;
  
    const pnjq = await pnjCollection.aggregate([
        { $match: {_id: new ObjectID(pnjId) }},
        {$lookup: {
          from: 'monstre',
          localField: 'pnj',
          foreignField: 'pnj',
          as: 'monstre'
        }},
        {$lookup: {
            from: 'item',
            localField: 'pnj',
            foreignField: 'pnj',
            as: 'item'
          }},
        { $unwind: '$monstre' },
        {$unwind:"item"},
        { $project: {nom: 1,monstre:1,item:1, _id: 1}},
    ]).toArray();
  
    res.json(pnjq);
  });




    app.post('/api/pnj/quette', addpnjquette);
    app.post('/api/pnj/vente', addpnjvente);
};