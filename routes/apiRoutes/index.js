const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/gasAPI/:id", (req, res) => {
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
            const result = response.map(function(element) {
                return axios.get(element.link).then(response => {
                    const $ = cheerio.load(response.data);
                    const gasArr = [];
                    $(".GasPriceCollection__fuelTypePriceSection___3iGR-").each((i, element) => {
                        const gasType = {};
                        gasType.type = $(element).children("span").text();
                        gasType.price = $(element).children(".GasPriceCollection__priceDisplay___1pnaL").children(".FuelTypePriceDisplay__displayContainer___3vnwR:first-child").children("span").text();
                        gasArr.push(gasType);
                    });
                    element.gasType = gasArr;
                    return element;
                })
            });
            Promise.all(result).then(response => {
                res.json(response);
            }).catch(err => {
                console.log(err);
            })
        });
})

module.exports = router;