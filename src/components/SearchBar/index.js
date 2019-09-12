import React, { Component } from "react";
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

    render() {
        return (
            <form className="search">
                <input type="text" placeholder="Search gas prices by city or zipcode..." onChange={this.handleInput} required />
            </form>
        );
    }
}

export default SearchBar;