import "./App.scss";
import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/header/Header.js";
import SignUp from "./pages/signup/SignUp.js";
import HomePage from "./pages/homepage/HomePage.js";
import Footer from "./components/footer/Footer.js";



export default class App extends Component {
  render() {
    return (
     
      
        <BrowserRouter>
        <Header/>
          <Switch>
          <Route path="/" exact component={HomePage} />      
          <Route path="/signup" component={SignUp} />  
          </Switch>
        </BrowserRouter>
     
    
    );
  }
}