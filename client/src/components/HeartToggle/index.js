import React from "react";
import "./style.sass";

const renderHeart = (saved, favorite, station, address, link, index) => {
    if (saved === true) {
        return <i className="fas fa-heart" onClick={() => favorite(station, address, link, index)}></i>
    } else {
        return <i className="far fa-heart" onClick={() => favorite(station, address, link, index)}></i>
    }
}

function HeartToggle(props) {
    return (
        <div>
            {renderHeart(props.saved, props.favorite, props.station, props.address, props.link, props.index)}
        </div>
    );
}

export default HeartToggle;