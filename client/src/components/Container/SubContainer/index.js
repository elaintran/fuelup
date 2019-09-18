import React from "react";
import "./style.sass";

function SubContainer(props) {
    return (
        <div className={`subcontainer ${props.display}`}>
            {props.children}
        </div>
    );
}

export default SubContainer;