import React from "react";
import Home from "./pages/Home.js";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                {/* <Route exact path="/" component={Home} /> */}
                <Route exact path="/login" component={Login} />
                <Route component={Register} />
            </Switch>
        </Router>
    );
}

export default App;