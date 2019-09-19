import React, { Component } from "react";
import SearchBar from "../components/SearchBar";
import Main from "./Main.js";
import API from "../utils/API.js";

class Home extends Component {
    state = {
        query: "",
        results: [],
        stations: this.props.station,
        currentCoordinates: "-97.7431,30.2672",
        prices: [],
        userId: this.props.userId,
        loggedIn: this.props.loggedIn,
        resultError: ""
    }

    componentDidMount() {
        // this.getGeolocation();
        this.searchGas("32003");
    }

    componentDidUpdate(prevProps) {
        if (this.props.loggedIn !== prevProps.loggedIn) {
            if (this.props.loggedIn === true) {
                this.setState({
                    userId: this.props.userId,
                    loggedIn: this.props.loggedIn
                });
            } else {
                this.setState({ loggedIn: this.props.loggedIn });
            }
        }
        if (this.props.favorites !== prevProps.favorites) {
            this.setState({ favorites: this.props.favorites });
        }
    }

    checkLoginStatus = () => {
        this.props.checkLogin();
    }

    getGeolocation = () => {
        var timeout = setTimeout(this.searchGas("78753"), 10000);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition, err => {

                // clearTimeout(timeout);
                // this.searchGas("78753");
            }, {timeout: 10000});
        } else {
            // this.searchGas("78753");
        }
    }

    showPosition = (position) => {
        API.geocode(`${position.coords.longitude}, ${position.coords.latitude}`)
            .then(response => {
                this.searchGas(response.data.features[2].text);
                this.setState({ currentCoordinates: `${position.coords.longitude},${position.coords.latitude}`});
            });
    }

    //Handles city and zipcode search input
    handleInput = event => {
        const name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }

    //Handles search submission and calls GasBuddy API function
    handleSubmit = event => {
        event.preventDefault();
        this.searchGas(this.state.query);
    }

    //Sends query to the GasBuddy scraper
    searchGas = query => {
        API.findGas(query)
            .then(response => {
                //Return prices of Regular fuel type to display on map
                const prices = response.data.map(prices => {
                    return prices.gasType[0].price
                });
                //Retrieves gas station data, and resets Brand and Fuel Type values
                this.setState({
                    results: response.data,
                    prices: prices
                });
            }).catch(err => {
                console.log(err);
                this.setState({ resultError: "Looks like there has been an error in your request. Please try again." })
            });
    }

    render() {
        return (
            <Main
                results={this.state.results}
                prices={this.state.prices}
                userId={this.props.userId}
                loggedIn={this.props.loggedIn}
                favorites={this.state.favorites}
                checkLogin={() => this.checkLoginStatus()}
                margin={{ marginLeft: "auto" }}
                resultError={this.state.resultError}>
                <SearchBar
                    change={this.handleInput}
                    submit={this.handleSubmit} />
            </Main>
        );
    }
}

export default Home;