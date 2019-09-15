import React from "react";
import Home from "./pages/Home.js";
import Register from "./pages/Register.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/register" component={Register} />
            </Switch>
        </Router>
    );
}

export default App;