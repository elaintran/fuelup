import React from "react";
import "./style.sass";

function ButtonContainer(props) {
    return (
        <div className="button-container">
            {props.children}
        </div>
    );
}

export default ButtonContainer;