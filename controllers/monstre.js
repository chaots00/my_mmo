const { object } = require("joi");
const { Db,ObjectID } = require("mongodb");

module.exports = (app, db) => {
  if (!(db instanceof Db)) {
    throw new Error("Invalid Database");
  }
  const monstreCollection = db.collection("monstre");

  const addmonstre = async(req, res)  => {
    const data = req.body;
    
  
    data.item = new ObjectID(data.item);
    data.pv = parseInt(data.pv);
    data.exp = parseInt(data.exp);
    data.dega = parseInt(data.dega);
console.log(data);
    const response = await monstreCollection.insertOne(data);
    

    if(response.result.n !== 1 || response.result.ok !== 1) {
      res.status(400).json({error: 'Impossible to save this classe ! '});
    }

    res.json(response.ops[0]);
  };

  

  app.get("/api/monstre/:monstreId", async (req, res) => {
    const { monstreId } = req.params;

    const monstre = await monstreCollection.aggregate([
        { $match: {_id: new ObjectID(monstreId) }},

        {$lookup: {
          from: 'item',
          localField: 'monstre',
          foreignField: 'monstre',
          as: 'item'
        }},
        { $unwind: '$item' },
        { $project: {nom: 1,pv:1,type:1,exp:1,dega:1,item:1, _id: 1}},
    ]).toArray();
        
    
        
    res.json(monstre);
  });

  app.post('/api/monstre', addmonstre);
    
};