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
import ErrorMessage from "../ErrorMessage";
import API from "../../utils/API.js";
import "./style.sass";

class NavBar extends Component {
    state = {
        fullName: this.props.fullName,
        email: "",
        password: "",
        loggedIn: this.props.loggedIn,
        loginErr: false,
        signUpErr: false,
        open: false
    }

    componentDidUpdate(prevProps) {
        if (this.props.loggedIn !== prevProps.loggedIn) {
            this.setState({
                loggedIn: this.props.loggedIn,
                fullName: this.props.fullName
            });
        }
    }

    checkLoginStatus = () => {
        this.props.checkLogin();
    }

    handleInput = event => {
        const name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }

    handleLogin = event => {
        event.preventDefault();
        API.login({email: this.state.email, password: this.state.password}).then(response => {
            this.setState({
                loginErr: false,
                signUpErr: false
            });
            this.checkLoginStatus();
        }).catch(err => {
            this.setState({ loginErr: true });
        });
    }

    handleSignUp = event => {
        event.preventDefault();
        API.register({
            fullName: this.state.fullName,
            email: this.state.email,
            password: this.state.password
        }).then(response => {
            if (response.data === "") {
                this.setState({ signUpErr: true });
            } else {
                this.handleLogin(event);
            }
        }).catch(err => {
            this.setState({ signUpErr: true });
        });
    }

    userLogout = () => {
        API.logout().then(response => {
            this.checkLoginStatus();
        });
    }

    openModal = () => this.setState({ open: true });
    closeModal = () => this.setState({ open: false });

    displayNavItems = () => {
        if (this.state.loggedIn === true) {
            return (
                <DropdownContainer>
                    <Dropdown text={this.state.fullName}>
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
                                <MenuButton
                                    name="Login"
                                    buttontype="open-button" />
                            }>
                            <Modal.Header>Login</Modal.Header>
                            <Modal.Content>
                                <UserForm submit={this.handleLogin}>
                                    {(this.state.loginErr === true) ? <ErrorMessage>Invalid password or email.</ErrorMessage> : false}
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
                                name="Sign Up"
                                buttontype="filled-button"
                                />
                            }>
                            <Modal.Header>Sign Up</Modal.Header>
                            <Modal.Content>
                                <UserForm submit={this.handleSignUp}>
                                    {(this.state.signUpErr === true) ? <ErrorMessage>This email is already taken.</ErrorMessage> : false}
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
            <FlexContainer>
                <p>Home</p>
                {(this.state.loggedIn === true) ? <Link to="/favorites"><p>Favorites</p></Link> : false}
                {this.displayNavItems()}
            </FlexContainer>
        );
    }
}

export default NavBar;