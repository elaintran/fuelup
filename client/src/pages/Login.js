import React, { Component } from "react";
import API from "../utils/API.js";

class Login extends Component {
    state = {
        email: "",
        password: ""
    }

    handleChange = event => {
        let value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    handleSubmit = event => {
        event.preventDefault();
        API.login(this.state).then(response => {
            window.location.pathname = "/";
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={this.handleChange} required/>
                <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required />
                <input type="submit" />
            </form>
        );
    }
}

export default Login;