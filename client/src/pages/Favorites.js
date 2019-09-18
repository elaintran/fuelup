import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import Main from "./Main.js";
import API from "../utils/API.js";

class Favorites extends Component {
    state = {
        results: [],
        stations: this.props.station,
        currentCoordinates: "-97.7431,30.2672",
        prices: [],
        filterPrices: [],
        userId: this.props.userId,
        loggedIn: this.props.loggedIn
    }

    componentDidUpdate(prevProps) {
        if (this.props.favorites !== prevProps.favorites) {
            this.searchFavorites(this.props.favorites);
        }
    }

    checkLoginStatus = () => {
        this.props.checkLogin();
    }

    //Sends query to the GasBuddy scraper
    searchFavorites = response => {
        const results = response.map(async results => {
            const pathname = results.link.split("/").pop();
            return API.findStation(pathname).then(async response => {
                return response.data;
            }).then(response => {
                results.gasType = response;
                return results;
            });
        });
        Promise.all(results).then(response => {
            const prices = response.map(prices => {
                return prices.gasType[0].price;
            });
            this.setState({ 
                results: response,
                prices: prices
            });
        });
    }

    render() {
        return (
            <Main
                results={this.state.results}
                favorites={this.state.results}
                prices={this.state.prices}
                userId={this.props.userId}
                loggedIn={this.props.loggedIn}
                checkLogin={() => this.checkLoginStatus()}>
                {console.log(this.props.favorites)}
            </Main>
        );
    }
}

export default Favorites;