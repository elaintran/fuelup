import React from "react";
import "./style.sass";

const renderHeart = (saved, favorite, unfavorite, station, address, link, index, id) => {
    if (saved === true) {
        return <i className="fas fa-heart" onClick={() => unfavorite(id)}></i>
    } else {
        return <i className="far fa-heart" onClick={() => favorite(station, address, link, index)}></i>
    }
}

function HeartToggle(props) {
    return (
        <div>
            {renderHeart(props.saved, props.favorite, props.unfavorite, props.station, props.address, props.link, props.index, props.favoriteId)}
        </div>
    );
}

export default HeartToggle;