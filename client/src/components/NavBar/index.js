import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import { Link } from "react-router-dom"; 
import { Dropdown } from "semantic-ui-react";
import UserForm from "../UserForm";
import FlexContainer from "../FlexContainer";
import DropdownContainer from "../DropdownContainer";
import MenuContainer from "../MenuContainer";
import MenuButton from "../MenuButton";
import ButtonContainer from "../ButtonContainer";
import API from "../../utils/API.js";
import "./style.sass";

class NavBar extends Component {
    state = {
        fullName: "",
        email: "",
        password: "",
        loggedIn: false,
        open: false
    }

    componentDidMount() {
        this.checkLoginStatus();
    }

    checkLoginStatus = () => {
        API.checkUser().then(response => {
            this.setState({ 
                loggedIn: true,
                fullName: response.data.fullName
            });
        }).catch(err => {
            this.setState({ loggedIn: false });
        });
    }

    handleInput = event => {
        const name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }

    handleLogin = event => {
        event.preventDefault();
        API.login({email: this.state.email, password: this.state.password}).then(response => {
            this.checkLoginStatus();
        }).catch(err => console.log(err));
    }


    openModal = () => this.setState({ open: true });
    closeModal = () => this.setState({ open: false });

    displayNavItems = () => {
        if (this.state.loggedIn === true) {
            return (
                <DropdownContainer>
                    <Dropdown text={`${this.state.firstName} ${this.state.lastName}`}>
                        <Dropdown.Menu>
                            <Dropdown.Item text="Sign Out" onClick={() => this.userLogout()} />
                        </Dropdown.Menu>
                    </Dropdown>
                </DropdownContainer>
            );
        } else {
            return (
                <MenuContainer>
                    <ButtonContainer>
                        <Modal trigger={
                            <MenuButton link="login" name="Login" />
                        }>
                            <Modal.Header>Login</Modal.Header>
                            <Modal.Content>
                                <UserForm submit={this.handleLogin}>
                                    <label>Email Address</label>
                                    <input className="input-type" type="email" name="email" placeholder="Email" onChange={this.handleInput} required/>
                                    <label>Password</label>
                                    <input className="input-type" type="password" name="password" placeholder="Password" onChange={this.handleInput} required />
                                    <input className="submit-type" type="submit" value="Login" />
                                    <p>Don't have an account? Sign up.</p>
                                </UserForm>
                            </Modal.Content>
                        </Modal>
                    </ButtonContainer>
                    <ButtonContainer>
                        <Modal trigger={
                            <MenuButton
                                link="/register"
                                name="Sign Up"
                                background="linear-gradient(0deg, rgba(255,119,93,1) 0%, rgba(255,136,94,1) 100%)"
                                white="white"
                                padding="11px 16px"
                                border="0"/>
                            }>
                            <Modal.Header>Sign Up</Modal.Header>
                            <Modal.Content>
                                <UserForm submit={this.handleSignUp}>
                                    <label>Full Name</label>
                                    <input className="input-type" type="text" name="fullName" placeholder="Full Name" onChange={this.handleInput} required/>
                                    <label>Email Address</label>
                                    <input className="input-type" type="email" name="email" placeholder="Email" onChange={this.handleInput} required/>
                                    <label>Password</label>
                                    <input className="input-type" type="password" name="password" placeholder="Password" onChange={this.handleInput} required />
                                    <input className="submit-type" type="submit" value="Sign Up" />
                                    <p>Have an account? Login.</p>
                                </UserForm>
                            </Modal.Content>
                        </Modal>
                    </ButtonContainer>
                </MenuContainer>
            );
        }
    }

    render() {
        return (
            <FlexContainer width="95%">
                <p>Home</p>
                {(this.state.loggedIn === true) ? <Link to="/favorites"><p>Favorites</p></Link> : false}
                {this.displayNavItems()}
            </FlexContainer>
        );
    }
}

export default NavBar;