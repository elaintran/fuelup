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

    searchGas = query => {
        API.findGas(query)
            .then(response => {
                // console.log(response.data);
                this.setState({ results: response.data });
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
            this.setState({ coordinates: response });
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
                    {this.state.results.map(results =>
                        <Results
                            station={results.station}
                            logo={results.logo}
                            address={results.address}
                            gasType={results.gasType}
                        />
                    )}
                </SubContainer>
                <SubContainer width="55%">
                    <Map coordinates={this.state.coordinates} />
                </SubContainer>
            </FlexContainer>
        );
    }
}

export default Home;