const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTstrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt');

function myPassportLocal(db) {
    const userCollection = db.collection('users');

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'mail',
                passwordField: 'password',
            },
            async (username, password, cb) => {
                try {
                    const user = await userCollection.findOne({
                        username,
                    });
                    if (user && bcrypt.compareSync(password, user.password)) {
                        return cb(null, user, { message: 'Logged In Successfully' });
                    }

                } catch (e) {
                    console.log(e);
                }

                return cb(null, false, { message: 'Incorrect email or password.' });


            }
        )
    );
}

function myPassportJWT() {
    passport.use(
        new JWTstrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: "maSignature"
        },function(jwtPayload,cb){
            return cb(null,jwtPayload);
        })
    )
}

module.exports = {
    myPassportLocal,myPassportJWT,
};