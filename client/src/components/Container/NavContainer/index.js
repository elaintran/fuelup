import React from "react";
import "./style.sass";

function NavContainer(props) {
    return (
        <div className="nav-container">
            {props.children}
        </div>
    );
}

export default NavContainer;