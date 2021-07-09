const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const userController = require("../../controllers/userController.js");
const stationController = require("../../controllers/stationController.js");
const passport = require("../../config/passport.js");

//GasBuddy Station Scraper
router.get("/gasbuddy/:id", (req, res) => {
    console.log(req.params.id);
    axios.get(`https://www.gasbuddy.com/home?search=${req.params.id}&fuel=1`)
        .then(response => {
            const $ = cheerio.load(response.data, {xmlMode: true});
            const resultArr = [];
            $(".GenericStationListItem-module__stationListItem___3Jmn4").each((i, element) => {
                const result = {};
                result.station = $(element).children("div:nth-child(2)").children("h3").text().trim();
                result.logo = "https://images.gasbuddy.io/33xauto/b/0.png";
                // result.logo = $(element).children("div:nth-child(1)").children("div:nth-child(1)").children("div:nth-child(1)").children("img").attr("src");
                if ($(".GenericStationListItem-module__stationListItem___3Jmn4").eq(i).children("div:nth-child(1)").children("div:nth-child(1)").children().length === 1) {
                    result.address = $(element).children("div:nth-child(2)").children("div:nth-child(3)").html().replace("<br/>", ", ");
                    result.link = `https://www.gasbuddy.com${$(element).children("div:nth-child(2)").children("h3").children("a").attr("href")}`;
                } else {
                    result.address = $(element).children("div:nth-child(2)").children("div:nth-child(4)").html().replace("<br/>", ", ");
                    result.link = `https://www.gasbuddy.com${$(element).children("div:nth-child(2)").children("h3").children("span").children("a").attr("href")}`;
                }
                resultArr.push(result);
            });
            console.log(resultArr);
            return resultArr;
        }).then(response => {
            const result = response.map(async function(element) {
                return axios.get(element.link).then(response => {
                    const $ = cheerio.load(response.data);
                    const gasArr = [];
                    $(".GasPriceCollection-module__fuelTypePriceSection___3iGR-").each((i, element) => {
                        const gasType = {};
                        gasType.type = $(element).children("span").text();
                        gasType.price = $(element).children("div").children("div").children("span").eq(0).text();
                        gasType.lastUpdated = $(element).children("div").children("div").children("div").eq(0).children("p").text();
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

router.get("/gasbuddy/station/:id", (req, res) => {
    axios.get(`https://www.gasbuddy.com/station/${req.params.id}`).then(response => {
        const $ = cheerio.load(response.data);
        const gasArr = [];
        $(".GasPriceCollection__fuelTypePriceSection___3iGR-").each((i, element) => {
            const gasType = {};
            gasType.type = $(element).children("span").text();
            gasType.price = $(element).children(".GasPriceCollection__priceDisplay___1pnaL").children(".FuelTypePriceDisplay__displayContainer___3vnwR:first-child").children("span").text();
            gasType.lastUpdated = $(element).children(".GasPriceCollection__priceDisplay___1pnaL").children(".FuelTypePriceDisplay__displayContainer___3vnwR:first-child").children(".FuelTypePriceDisplay__reportedBy___1yi7m").children("p").text();
            gasArr.push(gasType);
        });
        return gasArr;
    }).then(response => {
        res.json(response);
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