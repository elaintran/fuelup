import React from "react";
import "./style.sass";

function PriceMarker(props) {
    return (
        <div className="price-marker">
            <i className="fas fa-tag"></i>
            {props.price}
        </div>
    );
}

export default PriceMarker;