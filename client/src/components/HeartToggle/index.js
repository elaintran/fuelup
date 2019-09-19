import React from "react";
import "./style.sass";

const renderHeart = (saved, favorite, unfavorite, station, address, link, logo, index, id) => {
    if (saved === true) {
        return <i className="fas fa-heart" onClick={event => unfavorite(event, id)}></i>
    } else {
        return <i className="far fa-heart" onClick={event => favorite(event, station, address, link, logo, index)}></i>
    }
}

function HeartToggle(props) {
    return (
        <div>
            {renderHeart(props.saved, props.favorite, props.unfavorite, props.station, props.address, props.link, props.logo, props.index, props.favoriteId)}
        </div>
    );
}

export default HeartToggle;