import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home.js";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
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
            this.setState({
                userId: response.data._id,
                fullName: response.data.fullName,
                station: response.data.station,
                loggedIn: true
            });
        }).catch(err => {
            this.setState({ loggedIn: false });
        });
    }

    render() {
        return (
            <Router>
                <NavBar fullName={this.state.fullName} loggedIn={this.state.loggedIn} checkLogin={() => this.loginStatus()} />
                <Switch>
                    {(this.state.loggedIn === true) ? <Route exact path="/favorites" component={Favorites} /> : false }
                    <Route render={(props) => <Home
                        userId={this.state.userId}
                        station={this.state.station}
                        loggedIn={this.state.loggedIn}
                        checkLogin={() => this.loginStatus()} />} />
                </Switch>
            </Router>
        );
    }
}

export default App;