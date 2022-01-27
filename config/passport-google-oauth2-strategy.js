const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user')

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: "405444843384-e5db9d21jhm8oif3p1r0tumrg8u09bc0.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/user/auth/google/callback",
    },

    async function(accessToken, refreshToken, profile, done){
        try{
        //find a user
            const user = await User.findOne({email: profile.emails[0].value});
            // console.log("***Profile from Google OAuth",profile);
            if(user){
                // if found, set this user as req.user
                return done(null,user);
            }
            else{
                // if not found, create the user and set it as req.user
                const newUser = await User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })

                return done(null,newUser);
            }
        }catch(err){
            console.log('Error from Google OAuth', err);
            return;
        }
    }
))

module.exports = passport;