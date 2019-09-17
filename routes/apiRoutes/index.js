const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const userController = require("../../controllers/userController.js");
const stationController = require("../../controllers/stationController.js");
const passport = require("../../config/passport.js");

//GasBuddy Station Scraper
router.get("/gasbuddy/:id", (req, res) => {
    axios.get(`https://www.gasbuddy.com/home?search=${req.params.id}&fuel=1`)
        .then(response => {
            const $ = cheerio.load(response.data);
            const resultArr = [];
            $(".GenericStationListItem__stationListItem___3Jmn4").each((i, element) => {
                const result = {};
                result.station = $(element).children(".GenericStationListItem__mainInfoColumn___2kuPq").children(".header__header___1zII0").text().trim();
                result.logo = $(element).children(".GenericStationListItem__logoColumn___2oYl7").children(".StationBrandings__logoImages___1KnoP").children(".GenericStationListItem__logoImageContainer___2SVFN").children(".image__image___1ZUby").attr("src");
                result.address = $(element).children(".GenericStationListItem__mainInfoColumn___2kuPq").children(".GenericStationListItem__address___1VFQ3").html().replace("<br>", ", ");
                result.link = `https://www.gasbuddy.com${$(element).children(".GenericStationListItem__mainInfoColumn___2kuPq").children(".header__header___1zII0").children("a").attr("href")}`;
                resultArr.push(result);
            });
            return resultArr;
        }).then(response => {
            const result = response.map(async function(element) {
                return axios.get(element.link).then(response => {
                    const $ = cheerio.load(response.data);
                    const gasArr = [];
                    $(".GasPriceCollection__fuelTypePriceSection___3iGR-").each((i, element) => {
                        const gasType = {};
                        gasType.type = $(element).children("span").text();
                        gasType.price = $(element).children(".GasPriceCollection__priceDisplay___1pnaL").children(".FuelTypePriceDisplay__displayContainer___3vnwR:first-child").children("span").text();
                        gasType.lastUpdated = $(element).children(".GasPriceCollection__priceDisplay___1pnaL").children(".FuelTypePriceDisplay__displayContainer___3vnwR:first-child").children(".FuelTypePriceDisplay__reportedBy___1yi7m").children("p").text();
                        gasArr.push(gasType);
                    });
                    element.gasType = gasArr;
                    return element;
                });
            });
            Promise.all(result).then(response => {
                res.json(response);
            }).catch(err => {
                console.log(err);
            });
        });
});

//User Authentication
router.route("/register")
    .post(userController.create);

router.post("/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
});

router.get("/user", (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.sendStatus(401);
    }
});

router.get("/logout", (req, res) => {
    req.logout();
    res.sendStatus(200);
});

router.route("/user/:id")
    .post(stationController.create)

router.route("/user/:id/station/:stationId")
    .delete(stationController.remove)

router.route("/station/:id")
    .get(stationController.findOne)


module.exports = router;