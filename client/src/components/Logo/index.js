import React from "react";
import { Link } from "react-router-dom"; 
import "./style.sass";

function Logo() {
    return (
        <Link to="/">
            <div className="logo-container">
                <img src={require("../../images/fuelup-logo.png")} alt="fuelup-logo" className="logo-image" />
                <div className="logo">fuelup.</div>
            </div>
        </Link>
    );
}

export default Logo;