import React from "react";
import "./style.sass";

function MenuButton(props) {
    return (
        <div className={`menu-button ${props.buttontype}`} onClick={() => props.click()} {...props}>
            {props.name}
        </div>
    );
}

export default MenuButton;