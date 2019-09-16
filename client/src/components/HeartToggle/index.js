import React from "react";
import "./style.sass";

function HeartToggle(props) {
    return (
        <div>
            <i className="far fa-heart" onClick={() => props.favorite(props.station, props.address, props.link, props.index)}></i>
        </div>
    );
}

export default HeartToggle;