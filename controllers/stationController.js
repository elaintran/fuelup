const db = require("../models");

module.exports = {
    findAll: (req, res) => {
        db.Station.find()
            .then(response => res.json(response))
            .catch(err => res.status(422).json(err));
    },
    create: (req, res) => {
        db.Station.create(req.body)
            .then(response => res.json(response))
            .catch(err => res.status(422).json(err));
    },
    remove: (req, res) => {
        db.Station.remove({ _id: req.params.id })
            .then(response => res.json(response))
            .catch(err => res.status(422).json(err));
    }
}