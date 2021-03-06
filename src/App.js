import "./App.scss";
import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignUp from "./pages/signup/SignUp.js";
import UserProfile from "./pages/userprofile/UserProfile.js";
import HomePage from "./pages/homepage/HomePage.js";
import Comments from "./pages/comments/Comments.js";



export default class App extends Component {
  render() {
    return (
     
      
        <BrowserRouter>
          <Switch>
          <Route path="/" exact component={HomePage} />      
          <Route path="/signup" component={SignUp} />  
          <Route path="/user/:user_id" component={UserProfile} /> 
          <Route path="/post/:post_id/comments" component={Comments} /> 
          </Switch>
        </BrowserRouter>
     
    
    );
  }
}