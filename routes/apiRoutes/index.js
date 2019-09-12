const router = require("express").Router();
const axios = require("axios");

// router.get("/", (req, res) => {
//     console.log(req.body);
// })

module.exports = function(app) {
    router.get("/gasAPI", (req, res) => {
        axios.get(`https://www.gasbuddy.com/home?search=${req.body}&fuel=1`).then(data => {
            res.json(data);
        });
        // console.log(req.body);
    })

    router.use((req, res) => {
        res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
};
    // .get(`https://www.gasbuddy.com/home?search=${query}&fuel=1`)