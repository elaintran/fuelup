import React from "react";
import "./style.sass";

function Results(props) {
    return (
        <div className="results-card">
            <p>{props.station}</p>
            <p>{props.address}</p>
            <p>{props.price}</p>
            <p>{props.updated}</p>
            <p>{props.link}</p>
        </div>
    );
}

export default Results;