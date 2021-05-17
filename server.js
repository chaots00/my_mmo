const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const databaseConnexion  = require("./database/connexion");
const {myPassportLocal,myPassportJWT} = require ('./passport');
const passport = require('passport');

app.use(bodyParser.urlencoded({extended: true}));



(async () => {
    app.use('^/api', passport.authenticate('jwt',{session:false}));
    const db = await databaseConnexion();

    //passport
    myPassportLocal(db);
    myPassportJWT();

    //import controllers
 const users = require('./controllers/users');
 const classe = require('./controllers/classe');
 const item = require('./controllers/item');
 const monstre = require('./controllers/monstre');
 const pnj = require('./controllers/pnj');
 

    // call controllers
    users(app, db);
    classe(app, db);
    item(app, db);
    monstre(app, db);
    pnj(app, db);
    
    
    app.get('/', (req, res) => {
        res.send('Hello World!')
    });
    
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
})();