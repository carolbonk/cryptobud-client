import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import styles from './Header.module.scss';
import axios from "axios";
import Logo from '../../assets/images/Logo.svg';
import cryptobud from '../../assets/images/CRYPTOBUD.svg';
import App_store from '../../assets/images/App_store.svg';

export default class Header extends Component {

  render () {
 
    return (
      <header className={styles.header}>
      <Link to="/">
      {<img className={styles.logo} width="120px" height="50px" src={Logo}></img>}
      </Link>
      <div className={styles.cryptobud}>
      <img width="120px" height="20px" src={cryptobud}></img>
      </div>
      <div className={styles.app_store}>
        {(!!this.props.onLogOut) ? 
      <button className={styles.header__logOutButton} onClick={this.props.onLogOut}>Log Out</button> :
      <img className={styles.app_store} width="120px" height="40px" src={App_store}></img>
       }
      </div>
      </header>
    );}
  }