import React from "react";
import { Link } from "react-router-dom"; 
import "./style.sass";

function Logo() {
    return (
        <Link to="/"><div className="logo">fuelup.</div></Link>
    );
}

export default Logo;