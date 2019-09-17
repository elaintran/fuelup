import React from "react";
import "./style.sass";

const test = props => {
    const {...rest} = props;
    console.log({...rest});
}

function MenuButton(props) {
    return (
        <div className="menu-button"
            style={{
                background: props.background || "",
                color: props.white || "",
                padding: props.padding || "9px 14px",
                border: props.border || ""}} {...props}>
                {props.name}
        </div>
    );
}

export default MenuButton;