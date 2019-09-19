import React, { Component } from "react";
import { Dropdown, Segment, Dimmer, Loader, Image } from "semantic-ui-react";
import Map from "../components/Map";
import Results from "../components/Results";
import FlexContainer from "../components/Container/FlexContainer";
import SubContainer from "../components/Container/SubContainer";
import DropdownContainer from "../components/Container/DropdownContainer";
import ResultsContainer from "../components/Container/ResultsContainer";
import Button from "../components/Button";
import NoResultsMessage from "../components/NoResultsMessage";
import API from "../utils/API.js";

class Main extends Component {
    state = {
        results: this.props.results,
        favorites: [],
        filterResults: [],
        filter: false,
        prices: this.props.prices,
        brandPlaceholder: "Brand",
        fuelPlaceholder: "Fuel Type",
        coordinates: [],
        currentCoordinates: "-97.7431,30.2672",
        center: {
            longitude: "-97.7431",
            latitude: "30.2672"
        },
        zoom: 12,
        resultClicked: "",
        displayFavorites: false,
        distance: [],
        userId: this.props.userId,
        loggedIn: this.props.loggedIn,
        resultError: this.props.resultError
    }

    componentDidUpdate(prevProps) {
        if (this.props.results !== prevProps.results) {
            this.setState({
                results: this.props.results,
                prices: this.props.prices,
                resultClicked: ""
            }, () => this.convertAddress());
        }
        if (this.props.loggedIn !== prevProps.loggedIn) {
            this.setState({
                userId: this.props.userId,
                loggedIn: this.props.loggedIn
            });
        }
        if (this.props.favorites !== prevProps.favorites) {
            this.setState({ favorites: this.props.favorites }, () => this.checkFavorites());
        }
        if (this.props.resultError !== prevProps.resultError) {
            this.setState({ resultError: this.props.resultError });
        }
    }

    //Converts address from the results into longitude and latitude coordinates and adjusts the center of the map to the first result
    convertAddress = () => {
        let coordinates;
        //If no filter is applied,
        if (this.state.brandPlaceholder === "Brand" && this.state.fuelPlaceholder === "Fuel Type") {
            //Convert address of all results into coordinates
            coordinates = this.state.results.map(async address => this.renderLocation(address));
        } else {
            //If filter is applied, convert address of the filtered results
            coordinates = this.state.filterResults.map(async address => this.renderLocation(address));
        }
        //Wait for all axios calls to run
        Promise.all(coordinates).then(response => {
            const milesArr = response.map(async coordinates => {
                return API.directions(this.state.currentCoordinates, `${coordinates.longitude},${coordinates.latitude}`).then(response => {
                    const meters = response.data.routes[0].distance;
                    const miles = (meters * 0.000621371).toFixed(1);
                    return miles;
                })
            })
            Promise.all(milesArr).then(data => {
                //Then set state of the returned coordinates and adjust the center of the map to the coordinates of the first result
                if (response.length !== 0) {
                    this.setState({
                        coordinates: response,
                        center: response[0],
                        distance: data
                    });
                } else {
                    this.setState({ coordinates: [] });
                }
            })
        }).catch(err => {
            console.log(err);
        });
    }

    checkFavorites = () => {
        if (this.state.favorites.length === 0 && this.state.results.length === 0) {
            this.setState({
                displayFavorites: true
            });
        }
    }

    //Calls the Mapbox Forward Geocode API and converts address into longitude and latitude coordinates
    renderLocation = address => {
        return API.geocode(address.address).then(response => {
            const coordinatesObj = {
                longitude: response.data.features[0].center[0],
                latitude: response.data.features[0].center[1]
            };
            return coordinatesObj;
        });
    }

    //Adjust map zoom according to gas station clicked and zooms into selected point
    handleCenter = index => {
        this.setState({
            center: {
                longitude: this.state.coordinates[index].longitude,
                latitude: this.state.coordinates[index].latitude 
            },
            zoom: 13,
            resultClicked: index
        }, () => this.checkResults());
    }

    addFavorites = (station, address, link, logo, index) => {
        API.favorite({
            station: station,
            address: address,
            link: link,
            logo: logo,
            longitude: this.state.coordinates[index].longitude,
            latitude: this.state.coordinates[index].latitude
        }, this.state.userId).then(response => this.props.checkLogin());
    }

    removeFavorites = id => {
        API.unfavorite(this.state.userId, id).then(response => this.props.checkLogin());
    }

    checkResults = () => {
        if (this.state.results.length !== 0) {
            //If no filter is applied
            if (this.state.brandPlaceholder === "Brand" && this.state.fuelPlaceholder === "Fuel Type") {
                //Map out all of the returning results onto the page
                return this.state.results.map((results, index) => this.renderResults(results, index));
            } else {
                if (this.state.filterResults.length !== 0) {
                    return this.state.filterResults.map((results, index) => this.renderResults(results, index));
                } else {
                    return <NoResultsMessage>No results found.</NoResultsMessage>
                }
            }
        } else {
            if (this.state.resultError === "") {
                return (
                    <Segment>
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>
                    </Segment>
                );
            } else {
                if (this.state.favorites.length !== 0 && this.state.results.length !== 0) {
                    return <NoResultsMessage>{this.state.resultError}</NoResultsMessage>;
                }
            }
        }
    }

    //Display all unique brands in the Brand dropdown
    checkBrand = () => {
        //If search yields returning results
        if (this.state.results.length !== 0) {
            //Map out all of the gas stations from the results
            const station = this.state.results.map(station => station.station);
            //Filter out duplicate brands and return unique brands in an object format
            let stationSet = new Set(station);
            //Convert the brand objects into an array
            stationSet = [...stationSet];
            //Map out the brand array and return a list of dropdown items consisting of unique brands
            return stationSet.map((station, index) => <Dropdown.Item text={station} onClick={() => this.filterBrand(station)} key={index} />);
        }
    }

    //Function for Fuel Type dropdown items
    filterFuel = fuel => {
        let filterFuel = [];
        let filterPrices = [];
        let filter = false;
        //If a fuel type is selected and a brand is not selected
        if (fuel !== "Fuel Type" && this.state.brandPlaceholder === "Brand") {
            //Filter new results from the original results by fuel type
            filterFuel = this.state.results.filter(station => this.renderFuel(station, fuel));
        //If a fuel type and brand is selected
        } else if (fuel !== "Fuel Type" && this.state.brandPlaceholder !== "Brand") {
            //Filter new results from the filtered results by fuel type
            filterFuel = this.state.filterResults.filter(station => this.renderFuel(station, fuel));
        //If a fuel type is not selected and brand is selected
        } else if (fuel === "Fuel Type" && this.state.brandPlaceholder !== "Brand") {
            //Filter new results from the original results by brand
            filterFuel = this.state.results.filter(station => this.renderBrand(station, this.state.brandPlaceholder));
        }
        //If filter yields results
        if (filterFuel.length !== 0) {
            filterFuel = this.sortPrice(filterFuel, fuel);
            //Return prices to display on map depending on the fuel type selected
            filterPrices = filterFuel.map(prices => {
                return this.renderPrice(prices, fuel);
            });
            filter = true;
        }
        this.setState({
            filterResults: filterFuel,
            filterPrices: filterPrices,
            fuelPlaceholder: fuel,
            zoom: 12,
            filter: filter,
            resultClicked: ""
        }, () => this.convertAddress());
    }

    //Function for Brand dropdown items
    filterBrand = brand => {
        let filterStation = [];
        let filterPrices = [];
        let filter = false;
        //If brand is selected and fuel type is not selected
        if (brand !== "Brand" && this.state.fuelPlaceholder === "Fuel Type") {
            //Filter new results from the original results by brand
            filterStation = this.state.results.filter(station => this.renderBrand(station, brand));
        //If both brand and fuel type are selected
        } else if (brand !== "Brand" && this.state.fuelPlaceholder !== "Fuel Type") {
            //Filter new results from the filtered results by brand
            filterStation = this.state.filterResults.filter(station => this.renderBrand(station, brand));
        //If brand is not selected and fuel is selected
        } else if (brand === "Brand" && this.state.fuelPlaceholder !== "Fuel Type") {
            //Filter new results from the original results by fuel type
            filterStation = this.state.results.filter(station => this.renderFuel(station, this.state.fuelPlaceholder));
        }
        //If filter yields results and fuel type is not selected
        if (filterStation.length !== 0 && this.state.fuelPlaceholder === "Fuel Type") {
            //Return Regular gas prices to display on map
            filterPrices = filterStation.map(prices => {
                return prices.gasType[0].price;
            });
            filter = true;
        //If filter yields results and fuel type is selected
        } else if (filterStation.length !== 0 && this.state.fuelPlaceholder !== "Fuel Type") {
            //Return prices to display on map depending on the fuel type selected
            filterPrices = filterStation.map(prices => {
                return this.renderPrice(prices, this.state.fuelPlaceholder);
            });
            filter = true;
        }
        this.setState({
            filterResults: filterStation,
            filterPrices: filterPrices,
            brandPlaceholder: brand,
            zoom: 12,
            filter: filter,
            resultClicked: ""
        }, () => this.convertAddress());
    }

    sortPrice = (results, fuel) => {
        return results.sort((a, b) => {
            switch(fuel) {
                case "Midgrade":
                    return (a.gasType[1].price > b.gasType[1].price) ? 1 : -1;
                    break;
                case "Premium":
                    return (a.gasType[2].price > b.gasType[2].price) ? 1 : -1;
                    break;
                case "Diesel":
                    return (a.gasType[3].price > b.gasType[3].price) ? 1 : -1;
                    break;
                case "UNL88":
                    return (a.gasType[4].price > b.gasType[4].price) ? 1 : -1;
                    break;
                default:
                    return (a.gasType[0].price > b.gasType[0].price) ? 1 : -1;
            }
        });
    }

    //Checks if station has the fuel type selected
    renderFuel = (station, fuel) => {
        const filterStation = station.gasType.filter(gas => {
            if (gas.type === fuel && gas.price !== "- - -") {
                return gas;
            }
        });
        if (filterStation.length !== 0) {
            return station;
        }
    }

    //Checks if station matches the brand selected
    renderBrand = (station, brand) => {
        if (station.station === brand) {
            return station;
        }
    }

    //Display price on map depending on the type of fuel
    renderPrice = (prices, fuel) => {
        let price = "";
        switch(fuel) {
            case "Midgrade":
                price = prices.gasType[1].price;
                break;
            case "Premium":
                price = prices.gasType[2].price;
                break;
            case "Diesel":
                price = prices.gasType[3].price;
                break;
            case "UNL88":
                price = prices.gasType[4].price;
                break;
            default:
                price = prices.gasType[0].price;
        }
        return price;
    }

    renderResults = (results, index) => {
        let saved = false;
        let favoriteId = "";
        if (this.state.favorites.length !== 0) {
            this.state.favorites.map(favorites => {
                if (favorites.address === results.address) {
                    saved = true;
                    favoriteId = favorites._id;
                }
            });
        }
        return (
            <Results
                station={results.station}
                logo={results.logo}
                address={results.address}
                gasType={results.gasType}
                link={results.link}
                distance={this.state.distance[index]}
                id={index}
                key={index}
                click={this.handleCenter}
                loggedIn={this.state.loggedIn}
                favorite={this.addFavorites}
                unfavorite={this.removeFavorites}
                saved={saved}
                favoriteId={favoriteId}>
                {(this.state.resultClicked === index) ? 
                    <Button address={results.address}>
                        Get Directions
                    </Button> : false}
            </Results>
        )
    }

    render() {
        return (
            <FlexContainer display="display-group">
                <SubContainer display="col-45-w">
                    <FlexContainer display="col-100-w">
                        {this.props.children}
                        <DropdownContainer margin={this.props.margin}>
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
                    <ResultsContainer>
                        {(this.props.checkFavorites !== undefined && this.state.displayFavorites !== false)? this.props.checkFavorites() : false}
                        {this.checkResults()}
                    </ResultsContainer>
                </SubContainer>
                <SubContainer display="col-55-w">
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
        );
    }
}

export default Main;