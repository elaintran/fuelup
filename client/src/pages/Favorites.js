import React, { Component } from "react";
import { Link } from "react-router-dom"; 
import { Dropdown } from "semantic-ui-react";
import Map from "../components/Map";
import Results from "../components/Results";
import SearchBar from "../components/SearchBar";
import FlexContainer from "../components/FlexContainer";
import SubContainer from "../components/SubContainer";
import DropdownContainer from "../components/DropdownContainer";
import MenuContainer from "../components/MenuContainer";
import MenuButton from "../components/MenuButton";
import API from "../utils/API.js";

class Favorites extends Component {
    state = {
        query: "",
        results: [],
        filterResults: [],
        coordinates: [],
        currentCoordinates: {},
        center: {
            longitude: "-97.7431",
            latitude: "30.2672"
        },
        distance: [],
        prices: [],
        filterPrices: [],
        brandPlaceholder: "Brand",
        fuelPlaceholder: "Fuel Type",
        zoom: 12,
        search: false,
        filter: false,
        loggedIn: false,
        username: "",
        userId: ""
    }

    componentDidMount() {
        this.getGeolocation();
        this.checkLoginStatus();
    }

    checkLoginStatus = () => {
        API.checkUser().then(response => {
            this.setState({ 
                loggedIn: true,
                username: `${response.data.firstName} ${response.data.lastName}`,
                userId: response.data._id
            }, this.getFavorites(response.data.station));
        }).catch(err => {
            this.setState({ loggedIn: false });
        });
    }

    getFavorites = response => {
        const getStation = response.map(async station => {
            return API.getStation(station).then(response => response.data); 
        });
        Promise.all(getStation).then(data => {
            this.searchFavorites(data);
        });
    }

    userLogout = () => {
        API.logout().then(response => {
            this.setState({ loggedIn: false })
        });
    }

    displayNavItems = () => {
        if (this.state.loggedIn === true) {
            return (
                <DropdownContainer>
                    <Dropdown text={this.state.username}>
                        <Dropdown.Menu>
                            <Dropdown.Item text="Sign Out" onClick={() => this.userLogout()} />
                        </Dropdown.Menu>
                    </Dropdown>
                </DropdownContainer>
            );
        } else {
            return (
                <MenuContainer>
                    <MenuButton link="login" name="Login" />
                    <MenuButton link="register" name="Sign Up" padding="10px" background="linear-gradient(0deg, rgba(255,119,93,1) 0%, rgba(255,136,94,1) 100%)" />
                </MenuContainer>
            );
        }
    }

    getGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
            console.log("no favorites");
            // this.searchGas("78753");
        }
    }

    showPosition = position => {
        API.geocode(`${position.coords.longitude}, ${position.coords.latitude}`)
            .then(response => {
                // console.log(response.data.features[2].text);
                // this.searchFavorites(response.data.features[2].text);
                this.setState({ currentCoordinates: `${position.coords.longitude},${position.coords.latitude}`});
            });
    }

    //Handles city and zipcode search input
    handleInput = event => {
        let value = event.target.value;
        this.setState({ query: value });
    }

    //Handles search submission and calls GasBuddy API function
    handleSubmit = event => {
        event.preventDefault();
        this.searchFavorites(this.state.query);
    }

    //Adjust map zoom according to gas station clicked and zooms into selected point
    handleCenter = index => {
        // API.directions(this.state.currentCoordinates, `${this.state.coordinates[index].longitude},${this.state.coordinates[index].latitude}`).then(response => console.log(response));
        this.setState({
            center: {
                longitude: this.state.coordinates[index].longitude,
                latitude: this.state.coordinates[index].latitude 
            },
            zoom: 13
        });
    }

    //Sends query to the GasBuddy scraper
    searchFavorites = data => {
        const results = data.map(async results => {
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
            }, () => this.convertAddress());
        });
    }

    //Converts address from the results into longitude and latitude coordinates and adjusts the center of the map to the first result
    convertAddress = () => {
        let coordinates;
        //If no filter is applied,
        if (this.state.brandPlaceholder === "Brand" && this.state.fuelPlaceholder === "Fuel Type") {
            //Convert address of all results into coordinates
            coordinates = this.state.results.map(async address => this.renderLocation(address.longitude, address.latitude));
        } else {
            //If filter is applied, convert address of the filtered results
            coordinates = this.state.filterResults.map(async address => this.renderLocation(address.longitude, address.latitude));
        }
        //Wait for all axios calls to run
        Promise.all(coordinates).then(response => {
            const milesArr = response.map(async coordinates => {
                return API.directions(this.state.currentCoordinates, `${coordinates.longitude},${coordinates.latitude}`).then(response => {
                    const meters = response.data.routes[0].distance;
                    const miles = (meters * 0.000621371).toFixed(1);
                    return miles;
                });
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
                    this.setState({ coordinates: [] })
                }
            })
        }).catch(err => {
            console.log(err);
        });
    }

    checkResults = () => {
        //If no filter is applied
        if (this.state.brandPlaceholder === "Brand" && this.state.fuelPlaceholder === "Fuel Type") {
            //Map out all of the returning results onto the page
            return this.state.results.map((results, index) => this.renderResults(results, index));
        } else {
            if (this.state.filterResults.length !== 0) {
                return this.state.filterResults.map((results, index) => this.renderResults(results, index));
            } else {
                return <p>No results found.</p>
            }
        }
    }

    addFavorites = (station, address, link, index) => {
        API.favorite({
            station: station,
            address: address,
            link: link,
            longitude: this.state.coordinates[index].longitude,
            latitude: this.state.coordinates[index].latitude
        }, this.state.userId).then(response => this.checkLoginStatus());
    }

    removeFavorites = id => {
        API.unfavorite(this.state.userId, id).then(response => this.checkLoginStatus());
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
            return stationSet.map(station => <Dropdown.Item text={station} onClick={() => this.filterBrand(station)} />);
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
            filter: filter
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
            filter: filter
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

    //Returns individual results
    renderResults = (results, index) => {
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
                saved={true}
                // favoriteId={favoriteId}
            />
        );
    }

    //Calls the Mapbox Forward Geocode API and converts address into longitude and latitude coordinates
    renderLocation = (longitude, latitude) => {
        const coordinatesObj = {
            longitude: longitude,
            latitude: latitude
        };
        return coordinatesObj;
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

    render() {
        return (
            <div>
                <FlexContainer width="95%">
                    {/* {console.log(this.state.results)} */}
                    <p>Home</p>
                    {(this.state.loggedIn === true) ? <Link to="/favorites"><p>Favorites</p></Link> : false}
                    {this.displayNavItems()}
                </FlexContainer>
                <FlexContainer width="95%">
                    <SubContainer width="45%">
                        <FlexContainer>
                            <SearchBar
                                change={this.handleInput}
                                submit={this.handleSubmit}
                                value={this.state.searchValue}
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
                            search={true}
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

export default Favorites;