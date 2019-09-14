import React, { Component } from "react";
import Map from "../components/Map";
import Results from "../components/Results";
import SearchBar from "../components/SearchBar";
import FlexContainer from "../components/FlexContainer";
import SubContainer from "../components/SubContainer";
import DropdownContainer from "../components/DropdownContainer";
import { Dropdown } from "semantic-ui-react";
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
        zoom: 12,
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
            },
            zoom: 13
        });
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

    checkBrand = () => {
        if (this.state.results.length !== 0) {
            const station = this.state.results.map(station => station.station);
            let stationSet = new Set(station);
            stationSet = [...stationSet];
            return stationSet.map(station => <Dropdown.Item text={station} />);
        }
    }

    render() {
        return (
            <div>
                <FlexContainer width="95%">
                    <p>Home</p>
                    <DropdownContainer>
                        <Dropdown text="Elain Tran">
                            <Dropdown.Menu>
                                <Dropdown.Item text="Sign Out" />
                            </Dropdown.Menu>
                        </Dropdown>
                    </DropdownContainer>
                </FlexContainer>
                <FlexContainer width="95%">
                    <SubContainer width="45%">
                        <FlexContainer>
                            <SearchBar
                                change={this.handleInput}
                                submit={this.handleSubmit}
                            />
                            <DropdownContainer>
                                <Dropdown text="Fuel Type">
                                    <Dropdown.Menu>
                                        <Dropdown.Item text="Regular" />
                                        <Dropdown.Item text="Midgrade" />
                                        <Dropdown.Item text="Premium" />
                                        <Dropdown.Item text="Diesel" />
                                        <Dropdown.Item text="UNCL88" />
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown text="Brand">
                                    <Dropdown.Menu>
                                        {this.checkBrand()}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </DropdownContainer>
                        </FlexContainer>
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
                            price={this.state.prices}
                            zoom={this.state.zoom} />
                    </SubContainer>
                </FlexContainer>
            </div>
        );
    }
}

export default Home;