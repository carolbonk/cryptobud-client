import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import styles from "./HomePage.module.scss";
import axios from "axios";
import Footer from "../../components/footer/Footer.js";
import Login from "../../components/login/Login.js";
import { Particle } from 'jparticles'
import UnauthenticatedLanding from "../../components/unauthenticatedLanding/UnauthenticatedLanding";
import AuthenticatedHomepage from "../../components/authenticatedHomepage/AuthenticatedHomepage";

export default class HomePage extends Component {
  
  state = {
    user: null,
    messageCharCount:0,
    globalToggle: true
}

handlePostMessageChange = (event) => {
  this.setState({
    messageCharCount: event.target.value.length});
}

handleLogout = () => {
  sessionStorage.removeItem("token");
  this.setState({
      user: null
  });
};

  handleLogInSubmit = (event) => {
    event.preventDefault();

    axios
        .post('http://localhost:8080/users/login', {
            email: event.target.email.value,
            password: event.target.password.value
        })
        .then((response) => {
            sessionStorage.setItem("token", response.data.token);
            axios
            .get('http://localhost:8080/users/current', {
                headers: {
                    Authorization: 'Bearer ' + response.data.token
                }
            })
            .then((response) => {
                this.setState({
                    user: response.data
                });
            })
            .catch(() => {
                this.setState({
                    failedAuth: true
                })
            });
        })
        .catch((error) => {
            this.setState({ error: error.response.data });
        });
  }

  componentDidMount() {
    new Particle('#background',
    {
      color: '#25bfff',
      lineShape: 'cube',
      range: 2000,
      proximity: 100,
      parallax: true,
    });
  }

  handleToggleChange = () => {
    let currentToggle = this.state.globalToggle;
    this.setState({
      globalToggle: (!currentToggle)
    });
  }
  
  render() {
    return (
      <>
    { !this.state.user ? <UnauthenticatedLanding onLogIn={this.handleLogInSubmit}/> : <AuthenticatedHomepage  onGlobalToggleChange={this.handleToggleChange} globalToggle={this.state.globalToggle} onMessageChange={this.handlePostMessageChange} messageCharCount={this.state.messageCharCount} userFirstName={this.state.user.first_name} userLastName={this.state.user.last_name} userAvatar={this.state.user.avatar_url} onLogOut={this.handleLogout}/>}
    </>
    );
  }
}
