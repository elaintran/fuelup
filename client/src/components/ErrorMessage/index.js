import React from "react";
import "./style.sass";

function ErrorMessage(props) {
    return (
        <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{props.children}</p>
        </div>
    );
}

export default ErrorMessage;