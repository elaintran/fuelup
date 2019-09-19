import React from "react";
import "./style.sass";

function NoResultsMessage(props) {
    return (
        <div className="no-results">
            <i className="fas fa-exclamation-circle"></i>
            {props.children}
        </div>
    );
}

export default NoResultsMessage;