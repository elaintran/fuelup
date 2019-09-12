import React, { Component } from "react";
import API from "../../utils/API.js";
import "./style.sass";

class SearchBar extends Component {
    state = {
        query: "",
        results: [],
        search: false
    }

    handleInput = event => {
        let value = event.target.value;
        this.setState({ query: value });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.searchPrices(this.state.query);
    }

    searchPrices = query => {
        API.findPrices(query).then(response => {
            console.log(response.data);
        });
    }

    render() {
        return (
            <form className="search" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Search gas prices by city or zipcode..." onChange={this.handleInput} required />
            </form>
        );
    }
}

export default SearchBar;