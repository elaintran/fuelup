import React from "react";
import "./style.sass";

function SearchBar(props) {
    return (
        <form className="search" onSubmit={props.submit}>
            <input type="text" placeholder="Search gas prices by city or zipcode..." onChange={props.change} required />
        </form>
    );
}

export default SearchBar;