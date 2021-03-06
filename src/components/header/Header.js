import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import Logo from "../../assets/images/Logo.svg";
import cryptobud from "../../assets/images/CRYPTOBUD.svg";
import githublogo from "../../assets/images/githublogo.png";

export default class Header extends Component {
  render() {
    return (
      <header className={styles.header}>
        <Link to="/">
          {
            <img
              className={styles.logo}
              width="120px"
              height="50px"
              src={Logo}
            ></img>
          }
        </Link>
        <div className={styles.cryptobud}>
          <img width="120px" height="20px" src={cryptobud}></img>
        </div>

        <div className={styles.githublogo}>
          {!!this.props.onLogOut ? (
            <Link to="/">
              <button
                className={styles.logOutButton}
                onClick={this.props.onLogOut}
              >
                Log Out
              </button>{" "}
            </Link>
          ) : (
            <a href="https://github.com/carolbonk">
              <img
                className={styles.githublogo}
                width="60px"
                height="60px"
                src={githublogo}
              ></img>
            </a>
          )}
        </div>
      </header>
    );
  }
}
