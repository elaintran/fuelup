import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import NoResultsMessage from "../components/NoResultsMessage";
import Main from "./Main.js";
import API from "../utils/API.js";

class Favorites extends Component {
    state = {
        results: [],
        locationPlaceholder: "Location",
        city: [],
        prices: [],
        userId: this.props.userId,
        loggedIn: this.props.loggedIn
    }

    componentDidUpdate(prevProps) {
        if (this.props.favorites !== prevProps.favorites) {
            this.searchFavorites(this.props.favorites);
        }
        if (this.props.favorites === undefined) {
            this.props.checkLogin();
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
            }, () => this.checkFavorites());
        });
    }

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

    // filterLocation = location => {

    // }

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