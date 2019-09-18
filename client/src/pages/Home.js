import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import Map from "../components/Map";
import Results from "../components/Results";
import SearchBar from "../components/SearchBar";
import FlexContainer from "../components/FlexContainer";
import SubContainer from "../components/SubContainer";
import DropdownContainer from "../components/DropdownContainer";
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
        loggedIn: this.props.loggedIn
    }

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
        if (this.props.station !== prevProps.station) {
            this.setState({ stations: this.props.station });
        }
    }

    checkLoginStatus = () => {
        this.props.checkLogin();
    }

    getGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition, err => {
                console.log(err);
                this.searchGas("78753");
            });
            // if (navigator.geolocation.getCurrentPosition(this.showPosition) !== undefined) {
            //     navigator.geolocation.getCurrentPosition(this.showPosition);
            // } else {
            //     this.searchGas("78753");                
            // }
        } else {
            this.searchGas("78753");
        }
    }

    showPosition = position => {
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
            });
    }

    render() {
        return (
            <Main
                results={this.state.results}
                prices={this.state.prices}
                userId={this.props.userId}
                loggedIn={this.props.loggedIn}
                stations={this.state.stations}
                checkLogin={() => this.checkLoginStatus()}>
                <SearchBar
                    change={this.handleInput}
                    submit={this.handleSubmit} />
            </Main>
        );
    }
}

export default Home;