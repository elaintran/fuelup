import React, { Component } from "react";
import { Link } from "react-router-dom"; 
import { Dropdown } from "semantic-ui-react";
import UserForm from "../UserForm";
import FlexContainer from "../FlexContainer";
import DropdownContainer from "../DropdownContainer";
import MenuContainer from "../MenuContainer";
import MenuButton from "../MenuButton";
import API from "../../utils/API.js";
import "./style.sass";

class NavBar extends Component {
    state = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        loggedIn: false
    }

    componentDidMount() {
        this.checkLoginStatus();
    }

    checkLoginStatus = () => {
        API.checkUser().then(response => {
            this.setState({ 
                loggedIn: true,
                firstName: response.data.firstName,
                lastName: response.data.lastName
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
                    <MenuButton link="login" name="Login">
                        <form onSubmit={this.handleLogin}>
                            <input type="email" name="email" placeholder="Email" onChange={this.handleInput} required/>
                            <input type="password" name="password" placeholder="Password" onChange={this.handleInput} required />
                            <input type="submit" />
                        </form>
                    </MenuButton>
                    <MenuButton
                        link="/register"
                        name="Sign Up"
                        background="linear-gradient(0deg, rgba(255,119,93,1) 0%, rgba(255,136,94,1) 100%)"
                        white="white"
                        padding="11px 16px"
                        border="0" />
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