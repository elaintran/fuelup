import React from "react";
import "./style.sass";

function Button(props) {
    return (
        <div className="button" href={`https://www.google.com/maps/dir/?api=1&destination=${props.address}`} target="_blank">
            {props.children}
        </div>
    );
}

export default Button;