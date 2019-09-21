import React, { Component } from "react";
import SearchBar from "../components/SearchBar";
import Main from "./Main.js";
import API from "../utils/API.js";

class Home extends Component {
    state = {
        query: "",
        results: "",
        favorites: "",
        prices: [],
        userId: this.props.userId,
        loggedIn: this.props.loggedIn,
        error: ""
    }

    _isMounted = false;

    componentDidMount() {
        this.getGeolocation();
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

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkLoginStatus = () => {
        this.props.checkLogin();
    }

    getGeolocation = () => {
        API.getIP().then(response => {
            API.geocode(`${response.data.longitude}, ${response.data.latitude}`)
                .then(response => {
                    if (response.data.features[2].text !== undefined) {
                        this.searchGas(response.data.features[2].text);
                    } else {
                        this.searchGas("78753");
                    }
                }).catch(err => {
                    console.log(err);
                    this.searchGas("78753");
                });
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
        this._isMounted = true;
        this.setState({ results: "" });
        API.findGas(query)
            .then(response => {
                if (response.data.length !== 0) {
                    //Return prices of Regular fuel type to display on map
                    const prices = response.data.map(prices => {
                        return prices.gasType[0].price
                    });
                    //Retrieves gas station data, and resets Brand and Fuel Type values
                    this.setState({
                        results: response.data,
                        prices: prices
                    });
                } else {
                    this.setState({ results: [] });
                }
            }).catch(err => {
                console.log(err);
                this.setState({ error: "There has been an error in your request. Please try again later."});
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
                error={this.state.error}>
                <SearchBar
                    change={this.handleInput}
                    submit={this.handleSubmit} />
            </Main>
        );
    }
}

export default Home;