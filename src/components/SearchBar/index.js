import React, { Component } from "react";
import API from "../../utils/API.js";
import cheerio from "cheerio";
import "./style.sass";

class SearchBar extends Component {
    state = {
        query: "",
        results: [],
        search: false
    }

    handleInput = event => {
        let value = event.target.value;
        this.setState({ query: value });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.searchPrices(this.state.query);
    }

    searchPrices = query => {
        API.findPrices(query).then(response => {
            const $ = cheerio.load(response.data);
            const resultArr = [];
            $(".GenericStationListItem__stationListItem___3Jmn4").each((i, element)=> {
                const result = {};
                result.station = $(element).children(".GenericStationListItem__mainInfoColumn___2kuPq").children(".header__header___1zII0").text();
                result.logo = $(element).children(".GenericStationListItem__logoColumn___2oYl7").children(".StationBrandings__logoImages___1KnoP").children(".GenericStationListItem__logoImageContainer___2SVFN").children(".image__image___1ZUby").attr("src");
                result.address = $(element).children(".GenericStationListItem__mainInfoColumn___2kuPq").children(".GenericStationListItem__address___1VFQ3").html().replace("<br>", ", ");
                result.price = $(element).children(".GenericStationListItem__priceColumn___UmzZ7").children(".GenericStationListItem__priceContainer___YbVoO").children("span").text();
                result.lastUpdated = $(element).children(".GenericStationListItem__priceColumn___UmzZ7").children(".GenericStationListItem__priceContainer___YbVoO").children("div").children(".ReportedBy__postedTime___J5H9Z").text();
                resultArr.push(result);
            })
            this.setState({ results: resultArr});
            console.log(this.state.results);
        });
    }

    render() {
        return (
            <form className="search" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Search gas prices by city or zipcode..." onChange={this.handleInput} required />
            </form>
        );
    }
}

export default SearchBar;