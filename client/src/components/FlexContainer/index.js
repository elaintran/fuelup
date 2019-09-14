import React from "react";
import "./style.sass";

function FlexContainer(props) {
    return (
        <div className="main-container" style={{ width: props.width || "100%" }}>
            {props.children}
        </div>
    );
}

export default FlexContainer;