import React from "react";
import { Link } from "react-router-dom";
import "./style.sass";

function MenuButton(props) {
    return (
        <div className="button-container">
            <Link to={`/${props.link}`}>
                <div
                    className="menu-button"
                    style={{
                        background: props.background || "",
                        color: props.white || "",
                        padding: props.padding || "9px 14px",
                        border: props.border || ""}}>
                    {props.name}
                </div>
            </Link>
        </div>
    );
}

export default MenuButton;