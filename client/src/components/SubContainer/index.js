import React from "react";
import "./style.sass";

function SubContainer(props) {
    return (
        <div className="subcontainer" style={{ width: props.width }}>
            {props.children}
        </div>
    );
}

export default SubContainer;