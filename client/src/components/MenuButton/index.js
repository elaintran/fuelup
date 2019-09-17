import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import "./style.sass";

class MenuButton extends Component {
    render() {
        return (
            <div className="button-container">
                <Modal trigger={
                    <div
                        className="menu-button"
                        style={{
                            background: this.props.background || "",
                            color: this.props.white || "",
                            padding: this.props.padding || "9px 14px",
                            border: this.props.border || ""}}>
                        {this.props.name}
                    </div>}>
                    <Modal.Header>{this.props.name}</Modal.Header>
                    <Modal.Content>
                        {this.props.children}
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default MenuButton;