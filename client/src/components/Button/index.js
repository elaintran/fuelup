import React from "react";
import "./style.sass";

function Button(props) {
    return (
        <a className="button"
            href={`https://www.google.com/maps/dir/?api=1&destination=${props.address}`}
            target="_blank"
            rel="noopener noreferrer">
            {props.children}
        </a>
    );
}

export default Button;