import React, { Component } from "react";
import Map from "../components/Map";
import Results from "../components/Results";
import SearchBar from "../components/SearchBar";
import FlexContainer from "../components/FlexContainer";
import SubContainer from "../components/SubContainer";
import API from "../utils/API.js";

class Home extends Component {
    state = {
        query: "",
        results: [],
        coordinates: [],
        center: {
            longitude: "-97.7431",
            latitude: "30.2672"
        },
        prices: [],
        search: false
    }

    handleInput = event => {
        let value = event.target.value;
        this.setState({ query: value });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.searchGas(this.state.query);
    }

    handleCenter = index => {
        this.setState({ center: {
            longitude: this.state.coordinates[index].longitude,
            latitude: this.state.coordinates[index].latitude 
        }})
    }

    searchGas = query => {
        API.findGas(query)
            .then(response => {
                const prices = response.data.map(prices => {
                    return prices.gasType[0].price
                });
                this.setState({
                    results: response.data,
                    prices: prices,
                    search: true
                });
                this.convertAddress();
            });
    }

    convertAddress = () => {
        const coordinates = this.state.results.map(async address => {
            return API.forwardGeocode(address.address).then(response => {
                const coordinatesObj = {
                    longitude: response.data.features[0].center[0],
                    latitude: response.data.features[0].center[1]
                };
                return coordinatesObj;
            });
        });
        Promise.all(coordinates).then(response => {
            this.setState({
                coordinates: response,
                center: response[0]
            });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <FlexContainer>
                <SubContainer width="100%">
                    <SearchBar
                        change={this.handleInput}
                        submit={this.handleSubmit}
                    />
                </SubContainer>
                <SubContainer width="45%">
                    {this.state.results.map((results, index) =>
                        <Results
                            station={results.station}
                            logo={results.logo}
                            address={results.address}
                            gasType={results.gasType}
                            id={index}
                            key={index}
                            click={this.handleCenter}
                        />
                    )}
                </SubContainer>
                <SubContainer width="55%">
                    <Map
                        coordinates={this.state.coordinates}
                        center={this.state.center}
                        search={this.state.search}
                        price={this.state.prices} />
                </SubContainer>
            </FlexContainer>
        );
    }
}

export default Home;