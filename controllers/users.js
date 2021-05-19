const { Db, ObjectID } = require("mongodb");
const bcrypt = require('bcrypt');
const passport = require('passport');
const saltRound = 10;
const jwt = require('jsonwebtoken');
const Joi = require('joi');


module.exports = (app, db) => {
  if (!(db instanceof Db)) {
    throw new Error("Invalid Database");
  }
  const userCollection = db.collection("users");

  app.post('/login', async (req, res) => {
    passport.authenticate('local', { session: false }, (err, user) => {
      if (err || user) {
        return res.status(400).json({
          message: "sommeting is not right",
          user: user
        });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          return res.send(err);
        }

        const token = jwt.sign(user, "maSignature");

        return res.json({ user, token });

      });
    })(req, res)
  });

  app.post("/api/users", async (req, res) => {
    const schema = Joi.object({
      pseudo: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

      mail: Joi.string()
        .email()
        .required(),

      classe: Joi.string(),
      niv: Joi.number(),
      xp:Joi.number(),
      main:Joi.string(),
      argent:Joi.number(),

    })
      .with("mail", "password");
      
      const{error} = schema.validate(req.body);
        
      if(error != null){
          const firstError = error.details[0];
          return res.status(400).json({error : firstError.message})
      }

    const data = req.body;
    data.classe = new ObjectID(data.classe);
    data.main = new ObjectID(data.main);
    data.niv = parseInt(data.niv);
    data.xp = parseInt(data.xp);
    data.argent = parseInt(data.argent);
    console.log(data);
    try {
      data.password = bcrypt.hashSync(data.password, saltRound);
      const response = await db.collection("users").insertOne(data,);
      if (response.result.n !== 1 && response.result.ok !== 1) {
        return res.status(400).json({ error: "impossible to create the user" });
      }
      const user = response.ops[0];
      delete user.password;

      res.json(user);

    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "impossible to create the user" });
    }

  });

  // lister tous les utilisateurs
  app.get("/api/users", async (req, res) => {
    const users = await userCollection.find().toArray();

    res.json(users);
  });

  // lister un utilisateeur
  app.get("/users/:userId", async (req, res) => {
    const { userId } = req.params;

    const _id = new ObjectID(userId);
    const user = await userCollection.findOne({ _id });
    if (user == null) {
      return res.status(404).send({ error: "Impossible to find this user" });
    }

    res.json(user);
  });



  // Mettre à jour un utilisateur
  app.post("/api/users/:userId", async (req, res) => {
    const { userId } = req.params;
    const data = req.body;

    const _id = new ObjectID(userId);
    const response = await userCollection.findOneAndUpdate(
      { _id },
      { $set: data },
      {
        returnOriginal: false,
      }
    );

    if (response.ok !== 1) {
      return res.status(400).json({ error: "Impossible to update the user" });
    }
    res.json(response.value);
  });

  // Supprimer un utilisateur
  app.delete("/api/users/:userId", async (req, res) => {
    const { userId } = req.params;
    const _id = new ObjectID(userId);
    const response = await userCollection.findOneAndDelete({ _id });
    if (response.value === null) {
      return res.status(404).send({ error: "impossible to remove this user" });
    }

    res.status(204).send();
  });

  //ajouter une item
  app.post("/api/users/:userId/sac", async (req, res) => {
    const { userId } = req.params;
    const { item, } = req.body;
    const _id = new ObjectID(userId);

    const { value } = await userCollection.findOneAndUpdate(
      {
        _id,
      },
      {
        $push: {
          sac: {
            item: new ObjectID(),
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

  // Supprimer une item
  app.delete("/api/users/:userId/sac/:sacId", async (req, res) => {
    const { userId, sacId } = req.params;
    const _id = new ObjectID(userId);
    const _sacId = new ObjectID(sacId);

    const { value } = await userCollection.findOneAndUpdate(
      {
        _id,
      },
      {
        $pull: { sac: { _id: _sacId } },
      },
      {
        returnOriginal: false,
      }
    );

    res.json(value);
  });


  // Modifier un item
  app.post("/api/users/:userId/sac/:sacId", async (req, res) => {
    const { userId, sacId } = req.params;
    const { item, } = req.body;
    const _id = new ObjectID(userId);
    const _sacId = new ObjectID(sacId);

    const { value } = await userCollection.findOneAndUpdate(
      {
        _id,
        'sac._id': _sacId
      },
      {
        $set: {
          'sac.$.item': item,
        },
      },
      {
        returnOriginal: false,
      }
    );

    res.json(value);
  });


  // Récuperation de toutes les item
  app.get("/api/users/:userId/sac", async (req, res) => {
    const { userId } = req.params;

    const sac = await userCollection.aggregate([
      { $match: { _id: new ObjectID(userId) } },
      { $unwind: '$sac' },
      { $project: { sac: 1, _id: 0 } },
      {
        $addFields: {
          item: '$sac.item',
          _id: '$sac._id',
        }
      },
      { $project: { item: 1, sac: 1 } },
    ]).toArray();

    res.json(sac);
  });
  // recuperé toute les info 
  app.get("/api/users/:userId", async (req, res) => {
    const { userId } = req.params;

    const usersf = await userCollection.aggregate([
      { $match: { _id: new ObjectID(userId) } },
      {
        $lookup: {
          from: 'classe',
          localField: 'users',
          foreignField: 'users',
          as: 'classe'
        }
      },
      {
        $lookup: {
          from: 'item',
          localField: 'users',
          foreignField: 'users',
          as: 'main'
        }
      },
      { $unwind: '$classe' },
      { $unwind: '$main' },
      { $project: { classe: 1, pseudo: 1, main: 1, argent: 1, xp: 1, niv: 1, _id: 1 } },
    ]).toArray();

    res.json(usersf);
  });


};
