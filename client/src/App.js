import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home.js";
import Favorites from "./pages/Favorites.js";
import Expenses from "./pages/Expenses.js";
import NavBar from "./components/NavBar";
import API from "./utils/API.js";

class App extends Component {
    state = {
        userId: "",
        fullName: "",
        station: [],
        favorites: [],
        loggedIn: false
    }

    componentDidMount() {
        this.loginStatus();
    }

    loginStatus = () => {
        API.checkUser().then(response => {
            this.setState({
                userId: response.data._id,
                fullName: response.data.fullName,
                loggedIn: true
            }, () => this.getFavorites(response.data.station));
        }).catch(err => {
            this.setState({ loggedIn: false });
        });
    }

    getFavorites = response => {
        const getStation = response.map(async station => {
            return API.getStation(station).then(response => response.data); 
        });
        Promise.all(getStation).then(data => {
            this.setState({ favorites: data });
        });
    }

    render() {
        return (
            <Router>
                <NavBar
                    fullName={this.state.fullName}
                    loggedIn={this.state.loggedIn}
                    favorites={this.state.favorites}
                    checkLogin={() => this.loginStatus()} />
                <Switch>
                    {/* {(this.state.loggedIn === true) ?
                        <Route exact
                            path="/favorites"
                            render={(props) =>
                                <Favorites
                                    userId={this.state.userId}
                                    loggedIn={this.state.loggedIn}
                                    favorites={this.state.favorites}
                                    checkLogin={() => this.loginStatus()} />}
                            /> : false }
                    {this.state.loggedIn === true ? <Route exact path="/expenses" component={Expenses} />: false}
                    <Route render={(props) => <Home
                        userId={this.state.userId}
                        loggedIn={this.state.loggedIn}
                        favorites={this.state.favorites}
                        checkLogin={() => this.loginStatus()} />} /> */}
                    <Route component={Expenses} />
                </Switch>
            </Router>
        );
    }
}

export default App;