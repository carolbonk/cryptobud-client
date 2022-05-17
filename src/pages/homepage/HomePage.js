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
    globalToggle: true,
    posts:null
};

handlePostMessageChange = (event) => {
  this.setState({
    messageCharCount: event.target.value.length});
};

handlePostMessageSubmit = (event) => {
  console.log("here 1");
  event.preventDefault();

  let data = {
   message: event.target.message.value,
   global: this.state.globalToggle
  };

  var config = {
    method: 'post',
    url: 'http://localhost:8080/posts',
    headers: { 
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    },
    data : data
  };
  
  console.log("here");

  axios(config)
  .then((response) => {

    console.log(response);
    this.getPosts(true);


  })
  .catch(function (error) {
    console.log(error);
  });

};

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
            }, () => {this.getPosts(true)});
            
           
             
               
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

    this.getPosts(true);
    setInterval(() => {this.getPosts(true);}, 30000);
  }

  getPosts = (setState) => {

    if (!!this.state.user || !setState)
    {
    if (!sessionStorage.getItem('token')) {
      this.setState({ failedAuth: true });
      return;
    }

    var config = {
      method: 'get',
      url: 'http://localhost:8080/posts',
      headers: { 
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    };
    
    axios(config)
    .then((response) => {
      if (setState)
      {
      this.setState({posts: response.data});
      }
      else
      {
        let data = response.data;
        return data;
      }
    
    })
    .catch(function (error) {
      console.log(error);
    });
  }
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
    { !this.state.user ? <UnauthenticatedLanding onLogIn={this.handleLogInSubmit}/> : <AuthenticatedHomepage onMessageSubmit={this.handlePostMessageSubmit} posts={this.state.posts} onGlobalToggleChange={this.handleToggleChange} globalToggle={this.state.globalToggle} onMessageChange={this.handlePostMessageChange} messageCharCount={this.state.messageCharCount} userFirstName={this.state.user.first_name} userLastName={this.state.user.last_name} userAvatar={this.state.user.avatar_url} onLogOut={this.handleLogout}/>}
    </>
    );
  }
}
