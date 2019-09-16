const db = require("../models");
const passport = require("../config/passport.js");

module.exports = {
    create: (req, res) => {
        const user = new db.User(req.body);
        user.save(err => {
            if (err) {
                console.log(err);
            }
                // db.User.create(user)
                // .then(response => {
                //     console.log(response);
                //     res.json(response);
                // }).catch(err => console.log(err));
            
        });
            // .then(response => {
            //     req.login((response, err) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             res.redirect("/");
            //         }
            //         console.log("working!");
            //     });
            // }).catch(err => {
            //     if (err.name === "ValidationError") {
            //         res.redirect("/register");
            //     } else {
            //         console.log(err);
            //     }
            // });
    },
    authenticate: (req, res) => {
        console.log(req.body);
        res.json(req.body);
    }
}