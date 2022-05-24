import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./UnauthenticatedLanding.module.scss";
import Login from "../login/Login.js";
import { Particle } from "jparticles";
import Header from "../header/Header.js";

export default class UnauthenticatedLanding extends Component {
  componentDidMount() {
    new Particle("#background", {
      color: "#25bfff",
      lineShape: "cube",
      range: 2000,
      proximity: 100,
      parallax: true,
    });
  }

  render() {
    return (
      <>
        <Header />
        <main className={styles.landingPage}>
          <div className={styles.landingPage__background} id="background"></div>
          <div className={styles.landingPage__loginSection}>
            <Login onLogIn={this.props.onLogIn} />
            <p className={styles.landingPage__account}>
              Need an account?<Link to="/signup">Sign up!</Link>
            </p>
          </div>
        </main>
      </>
    );
  }
}
