import React from "react";
import "./style.sass";

function FlexContainer(props) {
    return (
        <div className={`main-container ${props.display || ""}`}>
            {props.children}
        </div>
    );
}

export default FlexContainer;