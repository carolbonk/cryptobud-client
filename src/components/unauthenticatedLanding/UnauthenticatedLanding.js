import React, { Component } from "react";
import { Link} from "react-router-dom";
import styles from "./UnauthenticatedLanding.module.scss";
import axios from "axios";
import Login from "../login/Login.js";
import { Particle } from 'jparticles'

export default class UnauthenticatedLanding extends Component {

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
          <main className={styles.landingPage}>
            <div className={styles.landingPage__background} id="background"></div>
            <div className={styles.landingPage__loginSection}>
            <Login />
            <p className={styles.signup__account}>
              Need an account? <Link to="/signup">Sign up</Link>
            </p>
            </div>
          </main>
        );
      }
}