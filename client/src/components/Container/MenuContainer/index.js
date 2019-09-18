import React from "react";
import "./style.sass";

function MenuContainer(props) {
    return (
        <div className="menu-container">
            {props.children}
        </div>
    );
}

export default MenuContainer;