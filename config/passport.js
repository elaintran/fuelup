const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

passport.use("local", new LocalStrategy((email, password, done) => {
    db.User.findOne({ email })
        .then(user => {
            if (!user || !user.checkPassword(password)) {
                done(null, false, { message: "Invalid username or password."})
            } else {
                done(null, user);
            }
        }).catch(err => console.log(err));
    })
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((user, done) => {
    db.User.findById(userId, (err, user) => done(err, user));
})

module.exports = passport;