import React, {Component} from 'react';
import {Link} from "react-router-dom";
import styles from './Post.module.scss';
import axios from "axios";


export default class Post extends Component {

  getDateString = (timestamp) => {
    let newDate = new Date(timestamp);
    return (
      newDate.getMonth() +
      1 +
      "/" +
      newDate.getDate() +
      "/" +
      newDate.getFullYear()
      +
      "   "
      +
      newDate.getHours() +
      ":"
      + 
      newDate.getMinutes()
    );
  };
 

  render () {
  let postDate = this.props.date;
    return (
     <div className={styles.post}>
    <a href="#" className={styles.post__foreGroundContent}>
         
         
         <p className={styles.post__date}>{this.getDateString(postDate)}</p>
         <img className={styles.post__avatar} src={this.props.avatar}></img>
         <label>{this.props.firstName + " " + this.props.lastName}</label>
         <p>{this.props.message}</p>
         
         <p>3 comments</p>
         <div></div> 



         </a>
    <a href="#" className={styles.post__backgroundContent}>
        
         <p className={styles.post__date}>{this.getDateString(postDate)}</p>
         <img className={styles.post__avatar} src={this.props.avatar}></img>
         <label>{this.props.firstName + " " + this.props.lastName}</label>
         <p>{this.props.message}</p>
         
         <p>3 comments</p>
         <div></div> 



        </a>
      </div>
    );}
  }