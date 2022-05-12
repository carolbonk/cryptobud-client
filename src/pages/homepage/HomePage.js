import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import styles from "./HomePage.module.scss";
import axios from "axios";
import Footer from "../../components/footer/Footer.js";
import Login from "../../components/login/Login.js";
import { Particle } from 'jparticles'

export default class HomePage extends Component {

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
  
  render() {
    return (
      <main className={styles.homePage}>
        <div className={styles.homePage__background} id="background"></div>
        <div className={styles.homePage__loginSection}>
        <Login />
        <p className={styles.signup}>
          Need an account? <Link to="/signup">Sign up</Link>
        </p>
        </div>
      </main>
    );
  }
}
