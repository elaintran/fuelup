import React from "react";
import "./style.sass";

function UserForm(props) {
    return (
        <form className="user-form" onSubmit={props.submit}>
            {props.children}
        </form>
    );
}

export default UserForm;