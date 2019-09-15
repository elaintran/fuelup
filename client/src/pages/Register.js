import React, { Component } from "react";
import API from "../utils/API.js";

class Register extends Component {
    state = {
        firstName: "",
        lastName: "",
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
        API.register(this.state);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" onChange={this.handleChange} required />
                <input type="text" name="lastName" placeholder="Last Name" onChange={this.handleChange} required/>
                <input type="email" name="email" placeholder="Email" onChange={this.handleChange} required/>
                <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required />
                <input type="submit" />
            </form>
        );
    }
}

export default Register;