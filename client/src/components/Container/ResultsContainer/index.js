import React from "react";
import "./style.sass";

function ResultsContainer(props) {
    return (
        <div className="results-container">
            {props.children}
        </div>
    );
}

export default ResultsContainer;