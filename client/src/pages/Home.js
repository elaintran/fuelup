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
        filterResults: [],
        coordinates: [],
        center: {
            longitude: "-97.7431",
            latitude: "30.2672"
        },
        prices: [],
        filterPrices: [],
        brandPlaceholder: "Brand",
        fuelPlaceholder: "Fuel Type",
        zoom: 12,
        search: false,
        filter: false
    }

    componentDidMount() {
        this.searchGas("78634");
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
        this.setState({
            center: {
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
                    search: true,
                    brandPlaceholder: "Brand"
                });
                this.convertAddress();
            });
    }

    convertAddress = () => {
        let coordinates;
        if (this.state.brandPlaceholder === "Brand" && this.state.fuelPlaceholder === "Fuel Type") {
            coordinates = this.state.results.map(async address => this.renderLocation(address));
        } else {
            coordinates = this.state.filterResults.map(async address => this.renderLocation(address));
        }
        Promise.all(coordinates).then(response => {
            this.setState({
                coordinates: response,
                center: response[0]
            });
        }).catch(err => {
            console.log(err);
        });
    }

    checkResults = () => {
        if (this.state.brandPlaceholder === "Brand" && this.state.fuelPlaceholder === "Fuel Type") {
            return this.state.results.map((results, index) => this.renderResults(results, index));
        } else {
            return this.state.filterResults.map((results, index) => this.renderResults(results, index));
        }
    }

    checkBrand = () => {
        if (this.state.results.length !== 0) {
            const station = this.state.results.map(station => station.station);
            let stationSet = new Set(station);
            stationSet = [...stationSet];
            return stationSet.map(station => <Dropdown.Item text={station} onClick={() => this.filterBrand(station)} />);
        }
    }

    filterFuel = fuel => {
        let filterFuel = [];
        let filterPrices = [];
        let filter = false;
        if (fuel !== "Fuel Type" && this.state.brandPlaceholder === "Brand") {
            filterFuel = this.state.results.filter(station => this.renderFuel(station, fuel));
        } else if (fuel !== "Fuel Type" && this.state.brandPlaceholder !== "Brand") {
            filterFuel = this.state.filterResults.filter(station => this.renderFuel(station, fuel));
        }
        if (filterFuel.length !== 0) {
            filterPrices = filterFuel.map(prices => {
                switch(fuel) {
                    case "Midgrade":
                        return prices.gasType[1].price;
                        break;
                    case "Premium":
                        return prices.gasType[2].price;
                        break;
                    case "Diesel":
                        return prices.gasType[3].price;
                        break;
                    case "UNL88":
                        return prices.gasType[4].price;
                        break;
                    default:
                        return prices.gasType[0].price;
                }
            });
            filter = true;
        }
        console.log(filterPrices);
        this.setState({
            filterResults: filterFuel,
            filterPrices: filterPrices,
            fuelPlaceholder: fuel,
            zoom: 12,
            filter: filter
        }, () => this.convertAddress());
    }

    filterBrand = brand => {
        let filterStation = [];
        let filterPrices = [];
        let filter = false;
        if (brand !== "Brand") {
            filterStation = this.state.results.filter(station => {
                if (station.station === brand) {
                    return station;
                }
            });
            filterPrices = filterStation.map(prices => {
                return prices.gasType[0].price;
            });
            filter = true;
        }
        this.setState({
            filterResults: filterStation,
            filterPrices: filterPrices,
            brandPlaceholder: brand,
            zoom: 12,
            filter: filter
        }, () => this.convertAddress());
    }

    renderResults = (results, index) => {
        return (
            <Results
                station={results.station}
                logo={results.logo}
                address={results.address}
                gasType={results.gasType}
                id={index}
                key={index}
                click={this.handleCenter}
            />
        );
    }

    renderLocation = address => {
        return API.forwardGeocode(address.address).then(response => {
            const coordinatesObj = {
                longitude: response.data.features[0].center[0],
                latitude: response.data.features[0].center[1]
            };
            return coordinatesObj;
        });
    }

    renderFuel = (station, fuel) => {
        const filterStation = station.gasType.filter(gas => {
            if (gas.type === fuel) {
                return gas;
            }
        });
        if (filterStation.length !== 0) {
            return station;
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
                                <Dropdown text={this.state.fuelPlaceholder}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item text="Fuel Type" onClick={() => this.filterFuel("Fuel Type")} />
                                        <Dropdown.Item text="Regular" onClick={() => this.filterFuel("Regular")} />
                                        <Dropdown.Item text="Midgrade" onClick={() => this.filterFuel("Midgrade")} />
                                        <Dropdown.Item text="Premium" onClick={() => this.filterFuel("Premium")} />
                                        <Dropdown.Item text="Diesel" onClick={() => this.filterFuel("Diesel")} />
                                        <Dropdown.Item text="UNL88" onClick={() => this.filterFuel("UNL88")} />
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown text={this.state.brandPlaceholder}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item text="Brand" onClick={() => this.filterBrand("Brand")} />
                                        {this.checkBrand()}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </DropdownContainer>
                        </FlexContainer>
                        {this.checkResults()}
                    </SubContainer>
                    <SubContainer width="55%">
                        <Map
                            coordinates={this.state.coordinates}
                            center={this.state.center}
                            search={this.state.search}
                            price={this.state.prices}
                            filterPrice={this.state.filterPrices}
                            zoom={this.state.zoom}
                            filter={this.state.filter} />
                    </SubContainer>
                </FlexContainer>
            </div>
        );
    }
}

export default Home;