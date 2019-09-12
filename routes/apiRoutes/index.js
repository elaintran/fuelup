const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/gasAPI/:id", (req, res) => {
    axios.get(`https://www.gasbuddy.com/home?search=${req.params.id}&fuel=1`)
        .then(response => {
            const $ = cheerio.load(response.data);
            const resultArr = [];
            $(".GenericStationListItem__stationListItem___3Jmn4").each((i, element)=> {
                const result = {};
                result.station = $(element).children(".GenericStationListItem__mainInfoColumn___2kuPq").children(".header__header___1zII0").text().trim();
                result.logo = $(element).children(".GenericStationListItem__logoColumn___2oYl7").children(".StationBrandings__logoImages___1KnoP").children(".GenericStationListItem__logoImageContainer___2SVFN").children(".image__image___1ZUby").attr("src");
                result.address = $(element).children(".GenericStationListItem__mainInfoColumn___2kuPq").children(".GenericStationListItem__address___1VFQ3").html().replace("<br>", ", ");
                result.price = $(element).children(".GenericStationListItem__priceColumn___UmzZ7").children(".GenericStationListItem__priceContainer___YbVoO").children("span").text();
                result.lastUpdated = $(element).children(".GenericStationListItem__priceColumn___UmzZ7").children(".GenericStationListItem__priceContainer___YbVoO").children("div").children(".ReportedBy__postedTime___J5H9Z").text();
                resultArr.push(result);
            });
            res.json(resultArr);
        });
})

module.exports = router;