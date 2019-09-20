import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import NoResultsMessage from "../components/NoResultsMessage";
import Main from "./Main.js";
import API from "../utils/API.js";

class Favorites extends Component {
    state = {
        results: "",
        prices: [],
        userId: this.props.userId,
        loggedIn: this.props.loggedIn,
        //State properties for potential location dropdown
        locationPlaceholder: "Location",
        city: []
    }

    componentDidUpdate(prevProps) {
        //Any updates to favorites in the database should search for database to display new listings
        if (this.props.favorites !== prevProps.favorites) {
            this.searchFavorites(this.props.favorites);
        }
        //Sometimes favorites come back as undefined instead of 0+ favorites
        //Makes a request to the database again to update the favorites
        if (this.props.favorites === undefined) {
            this.setState({ results: "" }, () => this.props.checkLogin());
        }
    }

    //Checks if user is logged in
    checkLoginStatus = () => {
        this.props.checkLogin();
    }

    //Sends query to the GasBuddy scraper
    searchFavorites = response => {
        //If the user has saved favorites
        if (this.state.results.length !== 0 || this.state.results !== undefined) {
            //Return a new array with gasTypes attached
            const results = response.map(async results => {
                //Retreive the end path of the link saved
                const pathname = results.link.split("/").pop();
                //Search GasBuddy and scrape the fuel prices
                return API.findStation(pathname).then(async response => {
                    //Returns an array of gas types and prices
                    return response.data;
                }).then(response => {
                    //Create a new property of gasTypes and append the gasTypes
                    results.gasType = response;
                    return results;
                });
            });
            //Once all of the async axios requests are complete
            Promise.all(results).then(response => {
                //Find the regular prices from favorites
                const prices = response.map(prices => {
                    return prices.gasType[0].price;
                });
                this.setState({ 
                    results: response,
                    prices: prices
                }, () => this.checkFavorites());
            });
        } else if (this.state.results.length === 0) {
            this.checkFavorites();
        }
    }

    //Finding all the cities from results for potential location dropdown
    checkCity = () => {
        if (this.state.results.length !== 0) {
            const city = this.state.results.map(async response => {
                return API.geocode(response.address).then(response => {
                    return response.data.features[1].text;
                });
            });
            Promise.all(city).then(response => {
                let citySet = new Set(response);
                citySet = [...citySet];
                this.setState({ city: citySet });
            });
        }
    }

    checkFavorites = () => {
        if (this.state.results.length === 0) {
            return <NoResultsMessage>No favorites added.</NoResultsMessage>;
        }
    }

    render() {
        return (
            <Main
                results={this.state.results}
                favorites={this.state.results}
                prices={this.state.prices}
                userId={this.props.userId}
                loggedIn={this.props.loggedIn}
                checkLogin={() => this.checkLoginStatus()}
                locationPlaceholder={this.state.locationPlaceholder}
                margin={{ marginRight: "auto" }}
                checkFavorites={() => this.checkFavorites()}>
                {/* <Dropdown text={this.state.locationPlaceholder}>
                    <Dropdown.Menu>
                        <Dropdown.Item text="Location" />
                        {this.state.city.map((city, index) => <Dropdown.Item text={city} onClick={() => this.filterLocation(city)} key={index} />)}
                    </Dropdown.Menu>
                </Dropdown> */}
            </Main>
        );
    }
}

export default Favorites;