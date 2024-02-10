const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const passport = require('passport');
const Auth = require('./auth');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id,done) => {
    const USER = await Auth.findById(id);
    done(null, USER);
})

module.exports = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.ClientID,
        clientSecret: process.env.ClientSecret,
        callbackURL: process.env.CallbackURL,
        passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        // try {
            let existingUser = await Auth.findOne({ 'google.id': profile.id });
            if (existingUser) {
                return done(null, existingUser);
                console.log(`User is already exist ${profile.displayName}`);
            }
            console.log('Creating new User..');
            const newAuth = new Auth({
                method:'google',
                google: {
                    id: profile.id,
                    name:profile.displayName,
                    email: profile.emails[0].value,
                    picture: profile.photos[0].value
                }
            });
            await newAuth.save();
            return done(null, newAuth);
        // }
        // catch (error) {
        //     return done(error, false)
        // }
    }
    ));
}