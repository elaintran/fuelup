const db = require("../models");

module.exports = {
    create: (req, res) => {
        db.User.create(req.body)
            .then(response => res.json(response))
            .catch(err => res.status(422).json(err));
    }
}