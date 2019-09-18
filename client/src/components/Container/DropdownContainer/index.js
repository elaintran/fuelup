import React from "react";
import "./style.sass";

function DropdownContainer(props) {
    return (
        <div className="dropdown-container">
            {props.children}
        </div>
    );
}

export default DropdownContainer;