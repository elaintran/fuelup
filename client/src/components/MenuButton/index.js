import React from "react";
import { Link } from "react-router-dom";
import "./style.sass";

function MenuButton(props) {
    return (
        // <div className="menu-button" style={{padding: props.padding || 0}, {background: props.background || "transparent"}}>
        <div className="menu-button">    
            <Link to={`/${props.link}`}>{props.name}</Link>
        </div>
    );
}

export default MenuButton;