import React from "react";
import "./style.sass";

function FlexContainer(props) {
    return (
        <div className="main-container">
            {props.children}
        </div>
    );
}

export default FlexContainer;