import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home.js";
import Favorites from "./pages/Favorites.js";
import NavBar from "./components/NavBar";
import API from "./utils/API.js";

class App extends Component {
    state = {
        userId: "",
        fullName: "",
        station: [],
        loggedIn: false
    }

    componentDidMount() {   
        this.loginStatus();
    }

    loginStatus = () => {
        API.checkUser().then(response => {
            console.log(response.data.station);
            this.setState({
                userId: response.data._id,
                fullName: response.data.fullName,
                loggedIn: true,
                station: response.data.station
            });
        }).catch(err => {
            console.log(err);
            this.setState({ loggedIn: false });
        });
    }

    render() {
        return (
            <Router>
                <NavBar
                    fullName={this.state.fullName}
                    loggedIn={this.state.loggedIn}
                    checkLogin={() => this.loginStatus()} />
                <Switch>
                    {(this.state.loggedIn === true) ?
                        <Route exact
                            path="/favorites"
                            render={() =>
                                <Favorites
                                    userId={this.state.userId}
                                    loggedIn={this.state.loggedIn}
                                    checkLogin={() => this.loginStatus()}
                                    station={this.state.station} />}
                            /> : false }
                    <Route render={() => <Home
                        userId={this.state.userId}
                        loggedIn={this.state.loggedIn}
                        station={this.state.station}
                        checkLogin={() => this.loginStatus()} />} />
                </Switch>
            </Router>
        );
    }
}

export default App;