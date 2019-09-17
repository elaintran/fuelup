import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home.js";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import Favorites from "./pages/Favorites.js";
import API from "./utils/API.js";

class App extends Component {
    state = {
        loggedIn: false
    }

    componentDidMount() {
        this.loginStatus();
    }

    loginStatus = () => {
        API.checkUser().then(response => {
            this.setState({ loggedIn: true });
        }).catch(err => {
            this.setState({ loggedIn: false });
        });
    }

    render() {
        return (
            <Router>
                <Switch>
                    {(this.state.loggedIn === true) ? <Route exact path="/favorites" component={Favorites} /> : false }
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route component={Home} />
                </Switch>
            </Router>
        );
    }
}

export default App;