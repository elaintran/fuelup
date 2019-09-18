import React from "react";
import "./style.sass";

function DropdownContainer(props) {
    return (
        <div className="dropdown-container" style={props.margin}>
            {props.children}
        </div>
    );
}

export default DropdownContainer;